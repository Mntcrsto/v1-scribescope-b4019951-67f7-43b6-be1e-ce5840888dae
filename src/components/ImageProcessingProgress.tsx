import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Search, CheckCircle, XCircle, Loader } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UploadProgress as UploadProgressType } from '@/types';
interface ImageProcessingProgressProps {
  progress: Record<string, UploadProgressType>;
}
const StatusIcon = ({ status }: { status: UploadProgressType['status'] }) => {
  switch (status) {
    case 'uploading':
      return <Upload className="h-5 w-5 text-blue-500" />;
    case 'searching':
      return <Search className="h-5 w-5 text-orange-500" />;
    case 'done':
      return <CheckCircle className="h-5 w-5 text-green-500" />;
    case 'error':
      return <XCircle className="h-5 w-5 text-red-500" />;
    default:
      return <Loader className="h-5 w-5 text-gray-500 animate-spin" />;
  }
};
const statusTextMap: Record<UploadProgressType['status'], string> = {
  pending: 'Pending...',
  uploading: 'Uploading...',
  searching: 'Searching for origin...',
  done: 'Complete!',
  error: 'Error',
};
export function ImageProcessingProgress({ progress }: ImageProcessingProgressProps) {
  const progressEntries = Object.values(progress);
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-4xl mx-auto"
    >
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-display text-center">Processing Images</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <AnimatePresence>
              {progressEntries.map(({ file, status, progress: value, error }) => (
                <motion.div
                  key={file.name}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-4 border rounded-lg bg-muted/50"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                      <ImagePreview file={file} />
                    </div>
                    <div className="flex-grow">
                      <p className="font-medium truncate text-sm">{file.name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <StatusIcon status={status} />
                        <span className="text-xs text-muted-foreground">
                          {error || statusTextMap[status]}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Progress value={value} className="mt-2 h-2" />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ImagePreview({ file }: { file: File }) {
  const [imageUrl, setImageUrl] = React.useState('');

  React.useEffect(() => {
    const url = URL.createObjectURL(file);
    setImageUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  return (
    <img
      src={imageUrl}
      alt={file.name}
      className="h-12 w-12 rounded-md object-cover"

    />
  );
}