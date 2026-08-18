import { type GeminiImage } from './gemini';

const MAX_EDGE = 1600;
const JPEG_QUALITY = 0.82;

export function extractBase64FromDataUrl(dataUrl: string): GeminiImage {
  const match = dataUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (!match) throw new Error('Invalid image data URL');
  return { mimeType: match[1], data: match[2] };
}

function drawToJpeg(source: CanvasImageSource, width: number, height: number): string {
  const scale = Math.min(1, MAX_EDGE / Math.max(width, height));
  const w = Math.max(1, Math.round(width * scale));
  const h = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Could not process image');
  ctx.drawImage(source, 0, 0, w, h);
  return canvas.toDataURL('image/jpeg', JPEG_QUALITY);
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Could not load image'));
    img.src = src;
  });
}

export async function fileToGeminiImage(file: File | Blob): Promise<GeminiImage> {
  const dataUrl = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ''));
    reader.onerror = () => reject(new Error('Could not read image'));
    reader.readAsDataURL(file);
  });
  const img = await loadImage(dataUrl);
  return extractBase64FromDataUrl(drawToJpeg(img, img.naturalWidth || img.width, img.naturalHeight || img.height));
}

export function captureVideoFrame(video: HTMLVideoElement): string {
  return drawToJpeg(video, video.videoWidth || 1280, video.videoHeight || 720);
}
