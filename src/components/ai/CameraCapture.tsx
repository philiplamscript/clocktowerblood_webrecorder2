import React, { useEffect, useRef } from 'react';
import { Camera, X } from 'lucide-react';
import { captureVideoFrame } from '../../lib/imageInput';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  onCancel: () => void;
  onUnavailable: () => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onCancel, onUnavailable }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const onUnavailableRef = useRef(onUnavailable);
  onUnavailableRef.current = onUnavailable;

  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: 'environment' } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play().catch(() => undefined);
        }
      } catch {
        if (!cancelled) onUnavailableRef.current();
      }
    };

    start();
    return () => {
      cancelled = true;
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    };
  }, []);

  const stop = () => {
    streamRef.current?.getTracks().forEach(track => track.stop());
    streamRef.current = null;
  };

  return (
    <div className="fixed inset-0 z-[10040] bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-950 rounded-2xl overflow-hidden w-full max-w-md border border-slate-700 shadow-2xl">
        <div className="flex items-center justify-between px-3 py-2 border-b border-slate-800">
          <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Camera</span>
          <button
            type="button"
            onClick={() => { stop(); onCancel(); }}
            className="p-1 text-slate-400 hover:text-white"
          >
            <X size={16} />
          </button>
        </div>
        <video ref={videoRef} playsInline autoPlay muted className="w-full aspect-[4/3] bg-black object-cover" />
        <div className="p-3 flex gap-2">
          <button
            type="button"
            onClick={() => { stop(); onCancel(); }}
            className="flex-1 py-2.5 rounded-xl bg-slate-800 text-slate-200 text-[10px] font-black uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (videoRef.current) {
                const dataUrl = captureVideoFrame(videoRef.current);
                stop();
                onCapture(dataUrl);
              }
            }}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-[10px] font-black uppercase flex items-center justify-center gap-2"
          >
            <Camera size={14} /> Take Photo
          </button>
        </div>
      </div>
    </div>
  );
};

export default CameraCapture;
