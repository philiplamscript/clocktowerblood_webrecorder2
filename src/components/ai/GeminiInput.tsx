import React, { useRef, useState } from 'react';
import { Camera, ImagePlus, Loader2, Sparkles, X } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { type GeminiImage } from '../../lib/gemini';
import { fileToGeminiImage, extractBase64FromDataUrl } from '../../lib/imageInput';
import { MISSING_GEMINI_KEY_TOAST } from '../../hooks/useGeminiSettings';
import CameraCapture from './CameraCapture';

const MAX_IMAGES = 3;

interface GeminiInputProps {
  hasKey: boolean;
  placeholder?: string;
  generateLabel?: string;
  showTextarea?: boolean;
  text?: string;
  onTextChange?: (value: string) => void;
  onGenerate: (payload: { text: string; images: GeminiImage[] }) => Promise<void>;
  requireInput?: boolean;
}

interface PreviewImage {
  id: string;
  previewUrl: string;
  image: GeminiImage;
}

const GeminiInput: React.FC<GeminiInputProps> = ({
  hasKey,
  placeholder = 'Type text, or add a photo…',
  generateLabel = 'Generate with Gemini',
  showTextarea = true,
  text: controlledText,
  onTextChange,
  onGenerate,
  requireInput = true,
}) => {
  const [internalText, setInternalText] = useState('');
  const [images, setImages] = useState<PreviewImage[]>([]);
  const [busy, setBusy] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const uploadRef = useRef<HTMLInputElement>(null);
  const captureRef = useRef<HTMLInputElement>(null);

  const text = controlledText ?? internalText;
  const setText = (value: string) => {
    if (onTextChange) onTextChange(value);
    else setInternalText(value);
  };

  const addImages = async (files: FileList | File[]) => {
    const incoming = Array.from(files).filter(file => file.type.startsWith('image/'));
    const room = MAX_IMAGES - images.length;
    if (room <= 0) {
      toast.error(`Up to ${MAX_IMAGES} photos.`);
      return;
    }
    try {
      const next = await Promise.all(incoming.slice(0, room).map(async (file) => ({
        id: `${Date.now()}_${file.name}_${Math.random().toString(36).slice(2, 7)}`,
        previewUrl: URL.createObjectURL(file),
        image: await fileToGeminiImage(file),
      })));
      setImages(prev => [...prev, ...next]);
    } catch {
      toast.error('Could not read that image.');
    }
  };

  const removeImage = (id: string) => {
    setImages(prev => {
      const target = prev.find(img => img.id === id);
      if (target?.previewUrl.startsWith('blob:')) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(img => img.id !== id);
    });
  };

  const openCamera = () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      captureRef.current?.click();
      return;
    }
    setShowCamera(true);
  };

  const handleGenerate = async () => {
    if (!hasKey) {
      toast.error(MISSING_GEMINI_KEY_TOAST);
      return;
    }
    if (requireInput && !text.trim() && images.length === 0) {
      toast.error('Add text or a photo first.');
      return;
    }
    setBusy(true);
    try {
      await onGenerate({ text, images: images.map(img => img.image) });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-2">
      {showTextarea && (
        <textarea
          className="w-full min-h-[72px] bg-white border border-slate-200 rounded-xl p-3 text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          placeholder={placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
      )}

      {images.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          {images.map(img => (
            <div key={img.id} className="relative w-14 h-14 rounded-lg overflow-hidden border border-slate-200">
              <img src={img.previewUrl} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.id)}
                className="absolute top-0.5 right-0.5 bg-slate-900/70 text-white rounded-full p-0.5"
              >
                <X size={10} />
              </button>
            </div>
          ))}
        </div>
      )}

      <div className="flex gap-2">
        <input
          ref={uploadRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addImages(e.target.files);
            e.target.value = '';
          }}
        />
        <input
          ref={captureRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) addImages(e.target.files);
            e.target.value = '';
          }}
        />
        <button
          type="button"
          onClick={() => uploadRef.current?.click()}
          className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase flex items-center justify-center gap-1.5 hover:border-indigo-300"
        >
          <ImagePlus size={12} /> Upload
        </button>
        <button
          type="button"
          onClick={openCamera}
          className="flex-1 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-[9px] font-black uppercase flex items-center justify-center gap-1.5 hover:border-indigo-300"
        >
          <Camera size={12} /> Capture
        </button>
      </div>

      <button
        type="button"
        onClick={handleGenerate}
        disabled={busy}
        className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-black uppercase flex items-center justify-center gap-2 shadow-sm disabled:opacity-60"
      >
        {busy ? <Loader2 size={14} className="animate-spin" /> : <Sparkles size={14} />}
        {busy ? 'Generating…' : generateLabel}
      </button>

      {showCamera && (
        <CameraCapture
          onCancel={() => setShowCamera(false)}
          onUnavailable={() => {
            setShowCamera(false);
            captureRef.current?.click();
          }}
          onCapture={(dataUrl) => {
            try {
              setImages(prev => {
                if (prev.length >= MAX_IMAGES) {
                  toast.error(`Up to ${MAX_IMAGES} photos.`);
                  return prev;
                }
                return [...prev, {
                  id: `cam_${Date.now()}`,
                  previewUrl: dataUrl,
                  image: extractBase64FromDataUrl(dataUrl),
                }];
              });
            } catch {
              toast.error('Could not capture photo.');
            } finally {
              setShowCamera(false);
            }
          }}
        />
      )}
    </div>
  );
};

export default GeminiInput;
