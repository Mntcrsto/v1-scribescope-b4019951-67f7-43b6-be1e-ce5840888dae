export interface UploadProgress {
  file: File;
  status: 'pending' | 'uploading' | 'searching' | 'done' | 'error';
  progress: number; // 0-100
  previewUrl?: string;
  error?: string;
}
export interface ImageResult {
  id: string;
  fileName: string;
  thumbnailUrl: string;
  mainSourceUrl: string;
  otherUrls: string[];
  domain: string;
  author: string;
  license: string;
  notes: string;
}
export interface SerpApiResult {
  image_sources?: { title: string; link: string; source: string }[];
  inline_images?: { source: string; link: string; title: string }[];
  image_results?: {
    title: string;
    link: string;
    source: {
      title: string;
      link: string;
    };
  }[];
  error?: string;
}