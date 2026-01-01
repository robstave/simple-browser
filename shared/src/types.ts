// API Response types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Directory and file types
export interface DirectoryEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  children?: DirectoryEntry[];
}

export interface ImageFile {
  name: string;
  path: string;
  size: number;
  extension: string;
}

export interface DirectoryListingResponse {
  path: string;
  directories: DirectoryEntry[];
  images: ImageFile[];
}

// Configuration types
export interface AppConfig {
  rootDirectory: string;
  port: number;
  allowedImageExtensions: string[];
}

// Health check response
export interface HealthCheckResponse {
  status: 'ok' | 'error';
  message: string;
  timestamp?: number;
}
