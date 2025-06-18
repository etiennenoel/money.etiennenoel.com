import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImageProcessorService {
  constructor() {}

  async processImage(file: File): Promise<ImageBitmap | null> {
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image:', file.type);
      return null;
    }
    try {
      const imageBitmap = await createImageBitmap(file);
      return imageBitmap;
    } catch (error) {
      console.error('Error processing image:', error);
      return null;
    }
  }
}
