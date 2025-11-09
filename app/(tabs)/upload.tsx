import React, { useState, useEffect, useRef } from 'react';
import { ScrollView, View, Text, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';
import { Feather } from '@expo/vector-icons';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"
import type { TriggerRef } from '@rn-primitives/select';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { categories } from '~/lib/constants';
import { supabase } from '~/backend/supabase';
import { Button } from '~/components/ui/button';
import { categoryToBucketName } from '~/backend/database-functions';

type MediaItem = {
  type: "pdf" | "video" | "audio" | "image";
  storagePath: string;
  title?: string;
  thumbnailPath?: string;
};

const getMediaType = (mimeType?: string): MediaItem['type'] => {
  if (!mimeType) return 'image';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'image';
};

// Generate batch years dynamically
const generateBatchYears = (): string[] => {
  const currentYear = new Date().getFullYear();
  const years: string[] = [];
  for (let year = 2020; year <= currentYear; year++) {
    years.push(year.toString());
  }
  return years;
};

const FormField = ({ label, children }: { label: string, children: React.ReactNode }) => (
  <View className="mb-4">
    <Text className="text-base font-medium text-foreground mb-2">{label}</Text>
    {children}
  </View>
);

export default function Upload() {
  const [title, setTitle] = useState("");
  const [authorName, setAuthorName] = useState("");
  const [department, setDepartment] = useState("");
  const [category, setCategory] = useState("");
  const [batchYear, setBatchYear] = useState("");
  const [body, setBody] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [thumbnail, setThumbnail] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [tags, setTags] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<TriggerRef>(null)
  const batchRef = useRef<TriggerRef>(null)
  const insets = useSafeAreaInsets();
  const contentInsets = {
    top: insets.top,
    bottom: Platform.select({ ios: insets.bottom, android: insets.bottom + 24 }),
    left: 12,
    right: 12,
  };

  function onTouchStart() {
    ref.current?.open();
  }

  function onBatchTouchStart() {
    batchRef.current?.open();
  }

  useEffect(() => {
    if (submissionSuccess || submissionError) {
      const timer = setTimeout(() => {
        setSubmissionSuccess(false);
        setSubmissionError(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submissionSuccess, submissionError]);

  const handlePickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({});
      if (!result.canceled && result.assets && result.assets[0]) {
        setFile(result.assets[0]);
        // Clear thumbnail when file changes
        setThumbnail(null);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
      console.error(error);
    }
  };

  const handlePickThumbnail = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'image/*',
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        setThumbnail(result.assets[0]);
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick thumbnail.");
      console.error(error);
    }
  };

  // Check if current file type requires a thumbnail
  const requiresThumbnail = (): boolean => {
    if (!file || !file.mimeType) return false;
    const mediaType = getMediaType(file.mimeType);
    return mediaType === 'video' || mediaType === 'pdf' || mediaType === 'audio';
  };

  const handleSubmit = async () => {
    if (!title || !authorName || !department || !category || !batchYear) {
      setSubmissionError("Please fill all required fields, including category and batch year.");
      return;
    }

    // Validate thumbnail if required
    if (requiresThumbnail() && !thumbnail) {
      setSubmissionError("Please upload a thumbnail for this file type.");
      return;
    }

    setIsLoading(true);
    setSubmissionSuccess(false);
    setSubmissionError(null);

    let mediaItemsPayload: MediaItem[] = [];

    if (file && category) {
      try {
        const bucketName = categoryToBucketName(category.value);
        const filePath = `${file.name}-${Date.now()}`;

        // Upload main file
        const response = await fetch(file.uri);
        const fileBuffer = await response.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, fileBuffer, { contentType: file.mimeType });

        if (uploadError && uploadError.message !== 'The resource already exists') {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        let thumbnailPath: string | undefined = undefined;

        // Upload thumbnail if exists
        if (thumbnail) {
          const thumbnailFilePath = `thumbnail/${thumbnail.name}-${Date.now()}`;

          const thumbnailResponse = await fetch(thumbnail.uri);
          const thumbnailBuffer = await thumbnailResponse.arrayBuffer();

          const { error: thumbnailUploadError } = await supabase.storage
            .from(bucketName)
            .upload(thumbnailFilePath, thumbnailBuffer, { contentType: thumbnail.mimeType });

          if (thumbnailUploadError && thumbnailUploadError.message !== 'The resource already exists') {
            throw new Error(`Thumbnail upload failed: ${thumbnailUploadError.message}`);
          }

          thumbnailPath = thumbnailFilePath;
        }

        mediaItemsPayload = [{
          type: getMediaType(file.mimeType),
          storagePath: filePath,
          title: file.name,
          ...(thumbnailPath && { thumbnailPath })
        }];

      } catch (error: any) {
        setSubmissionError(error.message);
        setIsLoading(false);
        return;
      }
    }

    const tagsArray = tags.split(",").map((tag) => tag.trim()).filter(tag => tag);
    const payload = {
      title,
      author_name: authorName,
      author_id: null,
      department,
      category: category.value,
      batch_year: parseInt(batchYear.value),
      body,
      media_items: mediaItemsPayload,
      tags: tagsArray,
      is_featured: false
    };

    const { error } = await supabase
      .from("upload")
      .insert([payload])
      .select();

    if (error) {
      setSubmissionError(`Submission failed: ${error.message}`);
    } else {
      setSubmissionSuccess(true);
      setTitle(""); setAuthorName(""); setDepartment(""); setCategory(""); setBatchYear("");
      setBody(""); setFile(null); setThumbnail(null); setTags("");
    }
    setIsLoading(false);
  };

  const batchYears = generateBatchYears();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="w-full max-w-lg p-2">
        <Text className="text-3xl font-bold text-foreground mb-8 text-center">Content Submission</Text>

        <FormField label="Title">
          <TextInput value={title} onChangeText={setTitle} style={styles.input} className='bg-secondary text-foreground' placeholderTextColor="#9ca3af" placeholder="e.g., The Midnight Sun" />
        </FormField>
        <FormField label="Author Name">
          <TextInput value={authorName} onChangeText={setAuthorName} style={styles.input} className='bg-secondary text-foreground' placeholderTextColor="#9ca3af" placeholder="Full name" />
        </FormField>
        <FormField label="Department">
          <TextInput value={department} onChangeText={setDepartment} style={styles.input} className='bg-secondary text-foreground' placeholderTextColor="#9ca3af" placeholder="e.g., Malayalam" />
        </FormField>
        <FormField label="Category">
          <Select onValueChange={setCategory} className='bg-secondary text-foreground' value={category}>
            <SelectTrigger ref={ref} className="w-full" onTouchStart={onTouchStart}>
              <SelectValue
                className="text-foreground text-sm native:text-md"
                placeholder="Select a category"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-full">
              <SelectGroup>
                <SelectLabel>Category</SelectLabel>
                {categories.map((cat) => (
                  <SelectItem key={cat.value} label={cat.category} value={cat.category}>
                    {cat.category}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Batch Year">
          <Select onValueChange={setBatchYear} className='bg-secondary text-foreground' value={batchYear}>
            <SelectTrigger ref={batchRef} className="w-full" onTouchStart={onBatchTouchStart}>
              <SelectValue
                className="text-foreground text-sm native:text-md"
                placeholder="Select batch year"
              />
            </SelectTrigger>
            <SelectContent insets={contentInsets} className="w-full">
              <SelectGroup>
                <SelectLabel>Batch Year</SelectLabel>
                {batchYears.map((year) => (
                  <SelectItem key={year} label={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </FormField>

        <FormField label="Description">
          <TextInput value={body} onChangeText={setBody} style={[styles.input, styles.textArea]} className='bg-secondary text-foreground' placeholderTextColor="#9ca3af" multiline placeholder="A short description of the artwork..." />
        </FormField>
        <FormField label="Upload art file (image, video, audio, pdf)">
          <Pressable onPress={handlePickDocument} className='bg-secondary text-foreground' style={styles.filePicker}>
            <Feather name="upload" size={20} color="red" />
            <Text className="text-secondary-foreground font-semibold ml-2">{file ? file.name : "Choose a file"}</Text>
          </Pressable>
        </FormField>

        {requiresThumbnail() && (
          <FormField label="Upload Thumbnail (Required)">
            <Pressable onPress={handlePickThumbnail} className='bg-secondary text-foreground' style={styles.filePicker}>
              <Feather name="image" size={20} color="red" />
              <Text className="text-secondary-foreground font-semibold ml-2">
                {thumbnail ? thumbnail.name : "Choose a thumbnail image"}
              </Text>
            </Pressable>
            <Text className="text-sm text-muted-foreground mt-1">
              A thumbnail is required for {getMediaType(file?.mimeType)} files
            </Text>
          </FormField>
        )}

        <FormField label="Tags (comma-separated)">
          <TextInput value={tags} onChangeText={setTags} style={styles.input} className='bg-secondary text-foreground' placeholderTextColor="#9ca3af" placeholder="e.g., poetry, nature, abstract" />
        </FormField>
        <Text className="text-sm text-muted-foreground">
          Your submission will be reviewed by our admin team before being published.
          Make sure all information is accurate.
        </Text>

        <Button className='mt-4' onPress={handleSubmit} disabled={isLoading}>
          <Text className='text-white'>{isLoading ? "Submitting..." : "Submit"}</Text>
        </Button>

        {submissionSuccess && (
          <View className="mt-4 p-4 bg-green-100 rounded-lg w-full">
            <Text className="font-bold text-green-800">Submission Successful!</Text>
            <View className="flex-row items-center mt-2">
              <Feather name="info" size={16} color="#1d4ed8" style={{ marginRight: 8 }} />
              <Text className="text-blue-700 font-medium">
                Your content will be live after admin approval.
              </Text>
            </View>
          </View>
        )}
        {submissionError && (
          <View className="mt-4 p-4 bg-red-100 rounded-lg w-full">
            <Text className="font-bold text-red-800">{submissionError}</Text>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top'
  },
  filePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
  },
});
