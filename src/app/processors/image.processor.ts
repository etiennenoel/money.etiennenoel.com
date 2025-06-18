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

  async convertToBase64(file: File): Promise<string | null> {
    if (!file.type.startsWith('image/')) {
      console.error('File is not an image:', file.type);
      return null;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        resolve(reader.result as string);
      };
      reader.onerror = (error) => {
        console.error('Error reading file for preview:', error);
        // Resolve with null as per Promise<string | null> signature
        resolve(null);
      };
      reader.readAsDataURL(file);
    });
  }
}
