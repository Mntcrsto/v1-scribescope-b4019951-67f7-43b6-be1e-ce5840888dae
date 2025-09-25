import React from 'react';
import { useDropzone } from 'react-dropzone';
import { motion } from 'framer-motion';
import { UploadCloud, Image as ImageIcon, SearchCode } from 'lucide-react';
import { cn } from '@/lib/utils';
interface ImageDropzoneProps {
  onDrop: (acceptedFiles: File[]) => void;
  isProcessing: boolean;
}
export function ImageDropzone({ onDrop, isProcessing }: ImageDropzoneProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpeg', '.png', '.gif', '.jpg', '.webp'] },
    disabled: isProcessing,
  });
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="w-full max-w-4xl mx-auto"
    >
      <div
        {...getRootProps()}
        className={cn(
          'relative group w-full p-8 md:p-12 border-4 border-dashed rounded-3xl cursor-pointer transition-all duration-300 ease-in-out',
          'flex flex-col items-center justify-center text-center space-y-6',
          isDragActive
            ? 'border-orange-500 bg-orange-500/10'
            : 'border-gray-300 dark:border-gray-700 hover:border-blue-500 hover:bg-blue-500/5',
          isProcessing ? 'cursor-not-allowed opacity-60' : ''
        )}
      >
        <input {...getInputProps()} />
        <motion.div
          className="absolute top-4 left-4 text-blue-400/50 group-hover:text-blue-500 transition-colors"
          animate={{ y: [-2, 2, -2], x: [-2, 2, -2] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ImageIcon size={48} strokeWidth={1} />
        </motion.div>
        <motion.div
          className="absolute bottom-4 right-4 text-orange-400/50 group-hover:text-orange-500 transition-colors"
          animate={{ y: [2, -2, 2], x: [2, -2, 2] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <SearchCode size={48} strokeWidth={1} />
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.1, rotate: -5 }}
          className="p-6 bg-blue-100 dark:bg-blue-900/30 rounded-full text-blue-600 dark:text-blue-400"
        >
          <UploadCloud size={64} strokeWidth={1.5} />
        </motion.div>
        {isDragActive ? (
          <p className="text-2xl font-semibold text-orange-600 dark:text-orange-400">
            Drop the images here!
          </p>
        ) : (
          <>
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 dark:text-gray-200">
              Drag & drop your photos
            </h2>
            <p className="text-gray-500 dark:text-gray-400">or click to select files</p>
            <p className="text-sm text-gray-400 dark:text-gray-500">
              Supports: JPG, PNG, GIF, WEBP
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}