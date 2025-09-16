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
  const [body, setBody] = useState("");
  const [file, setFile] = useState<DocumentPicker.DocumentPickerAsset | null>(null);
  const [tags, setTags] = useState("");
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const ref = useRef<TriggerRef>(null)
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
      }
    } catch (error) {
      Alert.alert("Error", "Failed to pick document.");
      console.error(error);
    }
  };

  const handleSubmit = async () => {
    // --- FIX 2: The validation check now works correctly for the category string ---
    if (!title || !authorName || !department || !category) {
      setSubmissionError("Please fill all required fields, including category.");
      return;
    }

    setIsLoading(true);
    setSubmissionSuccess(false);
    setSubmissionError(null);

    let mediaItemsPayload: MediaItem[] = [];

    if (file && category) {
      try {
        const bucketName = categoryToBucketName(category.value);
        const filePath = `${Date.now()}-${file.name}`;

        const response = await fetch(file.uri);
        const fileBuffer = await response.arrayBuffer();

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, fileBuffer, { contentType: file.mimeType });

        if (uploadError && uploadError.message !== 'The resource already exists') {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        mediaItemsPayload = [{
          type: getMediaType(file.mimeType),
          storagePath: filePath,
          title: file.name,
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
      body,
      media_items: mediaItemsPayload,
      tags: tagsArray,
      is_featured: false
    };

    const { data, error } = await supabase
      .from("upload")
      .insert([payload])
      .select();

    if (error) {
      setSubmissionError(`Submission failed: ${error.message}`);
    } else {
      setSubmissionSuccess(true);
      setTitle(""); setAuthorName(""); setDepartment(""); setCategory("");
      setBody(""); setFile(null); setTags("");
    }
    setIsLoading(false);
  };

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="w-full max-w-lg p-2">
        <Text className="text-3xl font-bold text-foreground mb-8 text-center">Content Submission</Text>

        <FormField label="Title">
          <TextInput value={title} onChangeText={setTitle} style={styles.input} className='bg-secondary' placeholderTextColor="#9ca3af" placeholder="e.g., The Midnight Sun" />
        </FormField>
        <FormField label="Author Name">
          <TextInput value={authorName} onChangeText={setAuthorName} style={styles.input} className='bg-secondary' placeholderTextColor="#9ca3af" placeholder="e.g., Jane Doe" />
        </FormField>
        <FormField label="Department">
          <TextInput value={department} onChangeText={setDepartment} style={styles.input} className='bg-secondary' placeholderTextColor="#9ca3af" placeholder="e.g., English" />
        </FormField>
        <FormField label="Category">
          <Select onValueChange={setCategory} className='bg-secondary' value={category}>
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
        <FormField label="Description">
          <TextInput value={body} onChangeText={setBody} style={[styles.input, styles.textArea]} className='bg-secondary' placeholderTextColor="#9ca3af" multiline placeholder="A short description of the artwork..." />
        </FormField>
        <FormField label="Upload Art File">
          <Pressable onPress={handlePickDocument} className='bg-secondary' style={styles.filePicker}>
            <Feather name="upload" size={20} color="red" />
            <Text className="text-secondary-foreground font-semibold ml-2">{file ? file.name : "Choose a file"}</Text>
          </Pressable>
        </FormField>

        <FormField label="Tags (comma-separated)">
          <TextInput value={tags} onChangeText={setTags} style={styles.input} className='bg-secondary' placeholderTextColor="#9ca3af" placeholder="e.g., poetry, nature, abstract" />
        </FormField>

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
