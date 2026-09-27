import 'server-only';

export type UploadInput = {
  key: string;
  contentType: string;
  body: Uint8Array;
};

export interface StorageProvider {
  upload(input: UploadInput): Promise<void>;
  remove(key: string): Promise<void>;
  getDownloadUrl(key: string): Promise<string>;
}

export function getStorageProvider(): StorageProvider {
  throw new Error('No object storage provider configured. Add an S3/R2 adapter before enabling uploads.');
}
