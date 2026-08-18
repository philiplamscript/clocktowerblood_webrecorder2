import { useCallback, useEffect, useState } from 'react';
import {
  GEMINI_KEY_STORAGE,
  GEMINI_MODEL_STORAGE,
  GEMINI_SETTINGS_EVENT,
  clearCachedModelList,
  notifyGeminiSettings,
  readGeminiApiKey,
  readGeminiModelId,
  writeGeminiModelId,
} from '../lib/gemini';

export const MISSING_GEMINI_KEY_TOAST = 'Add a Gemini API key in Settings';

export function useGeminiSettings() {
  const [apiKey, setApiKey] = useState(readGeminiApiKey);
  const [selectedModelId, setSelectedModelIdState] = useState(() => {
    const id = readGeminiModelId();
    if (typeof localStorage !== 'undefined' && localStorage.getItem(GEMINI_MODEL_STORAGE) !== id) {
      writeGeminiModelId(id);
    }
    return id;
  });

  useEffect(() => {
    const sync = () => {
      setApiKey(readGeminiApiKey());
      setSelectedModelIdState(readGeminiModelId());
    };
    window.addEventListener(GEMINI_SETTINGS_EVENT, sync);
    window.addEventListener('storage', sync);
    return () => {
      window.removeEventListener(GEMINI_SETTINGS_EVENT, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  const saveKey = useCallback((key: string) => {
    const trimmed = key.trim();
    if (trimmed) localStorage.setItem(GEMINI_KEY_STORAGE, trimmed);
    else localStorage.removeItem(GEMINI_KEY_STORAGE);
    setApiKey(trimmed);
    notifyGeminiSettings();
  }, []);

  const clearKey = useCallback(() => {
    localStorage.removeItem(GEMINI_KEY_STORAGE);
    clearCachedModelList();
    setApiKey('');
    notifyGeminiSettings();
  }, []);

  const setSelectedModelId = useCallback((id: string) => {
    const next = writeGeminiModelId(id);
    setSelectedModelIdState(next);
    notifyGeminiSettings();
  }, []);

  return {
    apiKey,
    hasKey: apiKey.trim().length > 0,
    saveKey,
    clearKey,
    selectedModelId,
    setSelectedModelId,
    modelId: selectedModelId,
  };
}
