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

type UploadProgress = {
  file: number;
  thumbnail: number;
  database: number;
};

const getMediaType = (mimeType?: string): MediaItem['type'] => {
  if (!mimeType) return 'image';
  if (mimeType.startsWith('image/')) return 'image';
  if (mimeType.startsWith('video/')) return 'video';
  if (mimeType.startsWith('audio/')) return 'audio';
  if (mimeType === 'application/pdf') return 'pdf';
  return 'image';
};

// Function to sanitize filenames - replace non-English characters with timestamp
const sanitizeFilename = (filename: string): string => {
  const ext = filename.substring(filename.lastIndexOf('.'));

  // Check if filename contains only safe characters (a-z, A-Z, 0-9, dash, underscore, dot)
  const isSafeFilename = /^[a-zA-Z0-9._-]+$/.test(filename.replace(ext, ''));

  if (isSafeFilename) {
    return filename;
  }

  // If not safe, replace with timestamp + extension
  return `file-${Date.now()}${ext}`;
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

const FormField = ({ label, required = false, children }: { label: string, required?: boolean, children: React.ReactNode }) => (
  <View className="mb-4">
    <Text className="text-base font-medium text-foreground mb-2">
      {label}
      {required && <Text className="text-red-500"> *</Text>}
    </Text>
    {children}
  </View>
);

// Progress Bar Component
const ProgressBar = ({ progress, label }: { progress: number; label: string }) => {
  return (
    <View className="mb-3">
      <View className="flex-row justify-between mb-1">
        <Text className="text-sm font-medium text-foreground">{label}</Text>
        <Text className="text-sm font-medium text-foreground">{Math.round(progress)}%</Text>
      </View>
      <View style={styles.progressContainer}>
        <View
          style={[
            styles.progressBar,
            { width: `${progress}%` }
          ]}
        />
      </View>
    </View>
  );
};

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
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    file: 0,
    thumbnail: 0,
    database: 0,
  });
  const [uploadStatus, setUploadStatus] = useState<string>("");

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

  const requiresThumbnail = (): boolean => {
    if (!file || !file.mimeType) return false;
    const mediaType = getMediaType(file.mimeType);
    return mediaType === 'video' || mediaType === 'pdf' || mediaType === 'audio';
  };

  const handleSubmit = async () => {
    // Validate all required fields
    if (!title.trim()) {
      setSubmissionError("Title is required.");
      return;
    }

    if (!authorName.trim()) {
      setSubmissionError("Author name is required.");
      return;
    }

    if (!department.trim()) {
      setSubmissionError("Department is required.");
      return;
    }

    if (!category) {
      setSubmissionError("Please select a category.");
      return;
    }

    if (!batchYear) {
      setSubmissionError("Please select a batch year.");
      return;
    }

    if (!body.trim()) {
      setSubmissionError("Description is required.");
      return;
    }

    if (!file) {
      setSubmissionError("Please upload an art file.");
      return;
    }

    if (!tags.trim()) {
      setSubmissionError("Tags are required.");
      return;
    }

    if (requiresThumbnail() && !thumbnail) {
      setSubmissionError("Please upload a thumbnail for this file type.");
      return;
    }

    setIsLoading(true);
    setSubmissionSuccess(false);
    setSubmissionError(null);
    setUploadProgress({ file: 0, thumbnail: 0, database: 0 });

    let mediaItemsPayload: MediaItem[] = [];

    if (file && category) {
      try {
        const bucketName = categoryToBucketName(category.value);

        // Sanitize filename
        const sanitizedFileName = sanitizeFilename(file.name);
        const filePath = `${sanitizedFileName}-${Date.now()}`;

        setUploadStatus("Uploading main file...");
        setUploadProgress(prev => ({ ...prev, file: 10 }));

        // Upload main file
        const response = await fetch(file.uri);
        const fileBuffer = await response.arrayBuffer();

        // Simulate progress for file upload
        setUploadProgress(prev => ({ ...prev, file: 50 }));

        const { error: uploadError } = await supabase.storage
          .from(bucketName)
          .upload(filePath, fileBuffer, { contentType: file.mimeType });

        if (uploadError && uploadError.message !== 'The resource already exists') {
          throw new Error(`File upload failed: ${uploadError.message}`);
        }

        setUploadProgress(prev => ({ ...prev, file: 100 }));

        let thumbnailPath: string | undefined = undefined;

        // Upload thumbnail if exists
        if (thumbnail) {
          setUploadStatus("Uploading thumbnail...");
          setUploadProgress(prev => ({ ...prev, thumbnail: 10 }));

          // Sanitize thumbnail filename
          const sanitizedThumbnailName = sanitizeFilename(thumbnail.name);
          const thumbnailFilePath = `thumbnail/${sanitizedThumbnailName}-${Date.now()}`;

          const thumbnailResponse = await fetch(thumbnail.uri);
          const thumbnailBuffer = await thumbnailResponse.arrayBuffer();

          setUploadProgress(prev => ({ ...prev, thumbnail: 50 }));

          const { error: thumbnailUploadError } = await supabase.storage
            .from(bucketName)
            .upload(thumbnailFilePath, thumbnailBuffer, { contentType: thumbnail.mimeType });

          if (thumbnailUploadError && thumbnailUploadError.message !== 'The resource already exists') {
            throw new Error(`Thumbnail upload failed: ${thumbnailUploadError.message}`);
          }

          setUploadProgress(prev => ({ ...prev, thumbnail: 100 }));
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
        setUploadStatus("");
        return;
      }
    }

    setUploadStatus("Saving to database...");
    setUploadProgress(prev => ({ ...prev, database: 10 }));

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

    setUploadProgress(prev => ({ ...prev, database: 50 }));

    const { error } = await supabase
      .from("upload")
      .insert([payload])
      .select();

    if (error) {
      setSubmissionError(`Submission failed: ${error.message}`);
    } else {
      setUploadProgress(prev => ({ ...prev, database: 100 }));
      setSubmissionSuccess(true);
      setTitle("");
      setAuthorName("");
      setDepartment("");
      setCategory("");
      setBatchYear("");
      setBody("");
      setFile(null);
      setThumbnail(null);
      setTags("");
      setUploadStatus("");
    }

    setIsLoading(false);
  };

  const batchYears = generateBatchYears();
  const totalProgress = uploadProgress.file > 0 || uploadProgress.thumbnail > 0 || uploadProgress.database > 0
    ? Math.round((uploadProgress.file + uploadProgress.thumbnail + uploadProgress.database) / 3)
    : 0;

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ alignItems: 'center', paddingVertical: 24, paddingHorizontal: 16 }}
    >
      <View className="w-full max-w-lg p-2">
        <Text className="text-3xl font-bold text-foreground mb-8 text-center">Content Submission</Text>

        <FormField label="Title" required>
          <TextInput
            value={title}
            onChangeText={setTitle}
            style={styles.input}
            className='bg-secondary text-foreground'
            placeholderTextColor="#9ca3af"
            placeholder="e.g., The Midnight Sun"
            editable={!isLoading}
          />
        </FormField>

        <FormField label="Author Name" required>
          <TextInput
            value={authorName}
            onChangeText={setAuthorName}
            style={styles.input}
            className='bg-secondary text-foreground'
            placeholderTextColor="#9ca3af"
            placeholder="Full name"
            editable={!isLoading}
          />
        </FormField>

        <FormField label="Department" required>
          <TextInput
            value={department}
            onChangeText={setDepartment}
            style={styles.input}
            className='bg-secondary text-foreground'
            placeholderTextColor="#9ca3af"
            placeholder="e.g., Malayalam"
            editable={!isLoading}
          />
        </FormField>

        <FormField label="Category" required>
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

        <FormField label="Batch Year" required>
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

        <FormField label="Description" required>
          <TextInput
            value={body}
            onChangeText={setBody}
            style={[styles.input, styles.textArea]}
            className='bg-secondary text-foreground'
            placeholderTextColor="#9ca3af"
            multiline
            placeholder="A short description of the artwork..."
            editable={!isLoading}
          />
        </FormField>

        <FormField label="Upload art file (image, video, audio, pdf)" required>
          <Pressable
            onPress={handlePickDocument}
            className='bg-secondary text-foreground'
            style={styles.filePicker}
            disabled={isLoading}
          >
            <Feather name="upload" size={20} color="red" />
            <Text className="text-secondary-foreground font-semibold ml-2">{file ? file.name : "Choose a file"}</Text>
          </Pressable>
        </FormField>

        {requiresThumbnail() && (
          <FormField label="Upload Thumbnail" required>
            <Pressable
              onPress={handlePickThumbnail}
              className='bg-secondary text-foreground'
              style={styles.filePicker}
              disabled={isLoading}
            >
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

        <FormField label="Tags (comma-separated)" required>
          <TextInput
            value={tags}
            onChangeText={setTags}
            style={styles.input}
            className='bg-secondary text-foreground'
            placeholderTextColor="#9ca3af"
            placeholder="e.g., poetry, nature, abstract"
            editable={!isLoading}
          />
        </FormField>

        <Text className="text-sm text-red-500 mb-2">* Required fields</Text>

        <Text className="text-sm text-muted-foreground mb-4">
          Your submission will be reviewed by our admin team before being published.
          Make sure all information is accurate.
        </Text>

        {/* Upload Progress Section */}
        {isLoading && (
          <View className="mb-4 p-4 bg-blue-50 rounded-lg">
            <Text className="font-semibold text-foreground mb-3">Uploading... {Math.round(totalProgress)}%</Text>

            {uploadProgress.file > 0 && (
              <ProgressBar progress={uploadProgress.file} label="Main File" />
            )}

            {uploadProgress.thumbnail > 0 && (
              <ProgressBar progress={uploadProgress.thumbnail} label="Thumbnail" />
            )}

            {uploadProgress.database > 0 && (
              <ProgressBar progress={uploadProgress.database} label="Saving to Database" />
            )}

            {uploadStatus && (
              <Text className="text-sm text-foreground mt-2">{uploadStatus}</Text>
            )}
          </View>
        )}

        <Button
          className='mt-4'
          onPress={handleSubmit}
          disabled={isLoading}
        >
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
  progressContainer: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 4,
  },
});
