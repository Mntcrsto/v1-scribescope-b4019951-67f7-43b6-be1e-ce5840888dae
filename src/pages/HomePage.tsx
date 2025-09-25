import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { ImageDropzone } from '@/components/ImageDropzone';
import { ImageProcessingProgress } from '@/components/ImageProcessingProgress';
import { ResultsTable } from '@/components/ResultsTable';
import { UploadProgress, ImageResult } from '@/types';

// Add thumbnailUrl to UploadProgress to manage blob URLs centrally
type UploadProgressWithUrl = UploadProgress & { thumbnailUrl: string };
type AppState = 'idle' | 'processing' | 'results';
export function HomePage() {
  const [appState, setAppState] = useState<AppState>('idle');
  const [uploadProgress, setUploadProgress] = useState<Record<string, UploadProgressWithUrl>>({});
  const [results, setResults] = useState<ImageResult[]>([]);
  useEffect(() => {
    // On component unmount, revoke all created blob URLs to prevent memory leaks.
    return () => {
      results.forEach(result => URL.revokeObjectURL(result.thumbnailUrl));
      Object.values(uploadProgress).forEach(item => URL.revokeObjectURL(item.thumbnailUrl));
    };
    // We only want this to run on unmount, but need `results` and `uploadProgress` in the closure.
    // An empty dependency array would have a stale `results` and `uploadProgress`.
    // Adding them to the dependency array makes it run on every change,
    // which is acceptable and ensures the final cleanup has the correct data.
  }, [results, uploadProgress]);

  const handleDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    setAppState('processing');
    const initialProgress = acceptedFiles.reduce((acc, file) => {
      acc[file.name] = { file, status: 'pending', progress: 0, thumbnailUrl: URL.createObjectURL(file) };
      return acc;
    }, {} as Record<string, UploadProgressWithUrl>);
    setUploadProgress(initialProgress);
    const newResults: ImageResult[] = [];
    // Process files sequentially to avoid overwhelming the API endpoint
    for (const file of acceptedFiles) {
      try {
        // Step 1: Uploading
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { ...prev[file.name], status: 'uploading', progress: 25 },
        }));
        const formData = new FormData();
        formData.append('image', file);
        const response = await fetch('/api/image-search', {
          method: 'POST',
          body: formData,
        });
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
          throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
        }
        // Step 2: Searching
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { ...prev[file.name], status: 'searching', progress: 75 },
        }));
        const resultData = await response.json();
        const newResult: ImageResult = {
          id: crypto.randomUUID(),
          fileName: file.name,
          thumbnailUrl: initialProgress[file.name].thumbnailUrl, // Reuse existing blob URL
          mainSourceUrl: resultData.mainSourceUrl || '',
          otherUrls: resultData.otherUrls || [],
          domain: resultData.domain || '',
          author: resultData.author || '',
          license: resultData.license || '',
          notes: '',
        };
        newResults.push(newResult);
        // Step 3: Done
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { ...prev[file.name], status: 'done', progress: 100 },
        }));
      } catch (error) {
        console.error('Error processing file:', file.name, error);
        const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
        toast.error(`Failed to process ${file.name}`, { description: errorMessage });
        setUploadProgress(prev => ({
          ...prev,
          [file.name]: { ...prev[file.name], status: 'error', progress: 0, error: errorMessage },
        }));
      }
    }
    // Update results and app state AFTER all files are processed
    setResults(prev => [...prev, ...newResults]);
    setAppState('results');
  }, []);
  const handleNoteChange = (id: string, note: string) => {
    setResults(prevResults =>
      prevResults.map(r => (r.id === id ? { ...r, notes: note } : r))
    );
  };
  const handleReset = () => {
    // Revoke object URLs before clearing results to prevent memory leaks
    results.forEach(result => URL.revokeObjectURL(result.thumbnailUrl));
    Object.values(uploadProgress).forEach(item => URL.revokeObjectURL(item.thumbnailUrl));
    setAppState('idle');
    setUploadProgress({});
    setResults([]);
  };
  const isProcessing = useMemo(() => appState === 'processing', [appState]);
  const renderContent = () => {
    switch (appState) {
      case 'idle':
        return <ImageDropzone onDrop={handleDrop} isProcessing={isProcessing} />;
      case 'processing':
        return <ImageProcessingProgress progress={uploadProgress} />;
      case 'results':
        return <ResultsTable results={results} onNoteChange={handleNoteChange} onReset={handleReset} />;
      default:
        return null;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        <div className="text-center space-y-4 mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center items-center gap-4"
          >
            <Search className="h-12 w-12 text-blue-500" strokeWidth={1} />
            <h1 className="text-5xl md:text-6xl font-display" style={{ color: 'rgb(60, 100, 170)' }}>
              ScribeScope
            </h1>
          </motion.div>
          <motion.p
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto"
          >
            Automatically find the origin, author, and usage rights for your images.
          </motion.p>
        </div>
        <div className="flex justify-center">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-8 text-sm text-gray-500 dark:text-gray-400">
        <p>Built with ❤�� at Cloudflare</p>
      </footer>
      <Toaster richColors position="top-right" />
    </div>
  );
}