import React, { useEffect, useState } from 'react';
import { ChevronDown, Eye, EyeOff, ExternalLink, KeyRound, RefreshCw, Save, Sparkles, Trash2 } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { useGeminiSettings } from '../../../../hooks/useGeminiSettings';
import {
  listGeminiModels,
  loadCachedModelList,
  mergeModelOptions,
  pickDefaultModel,
  type GeminiListedModel,
} from '../../../../lib/gemini';

const GeminiSection: React.FC = () => {
  const { apiKey, hasKey, saveKey, clearKey, selectedModelId, setSelectedModelId } = useGeminiSettings();
  const [draftKey, setDraftKey] = useState(apiKey);
  const [showKey, setShowKey] = useState(false);
  const [showHowTo, setShowHowTo] = useState(false);
  const [listed, setListed] = useState<GeminiListedModel[]>(loadCachedModelList);
  const [loadingModels, setLoadingModels] = useState(false);

  const { options, missingSelected } = mergeModelOptions(listed, selectedModelId);

  const refreshModels = async (key = apiKey, quiet = false) => {
    if (!key.trim()) return;
    setLoadingModels(true);
    try {
      const models = await listGeminiModels(key);
      setListed(models);
      if (models.length === 0) {
        if (!quiet) toast.error('No generateContent models returned. Using latest aliases.');
        return;
      }
      const merged = mergeModelOptions(models, selectedModelId);
      if (merged.missingSelected) {
        const next = pickDefaultModel(models);
        setSelectedModelId(next);
        toast.success(`Saved model is retired. Switched to ${next}.`);
      } else if (!quiet) {
        toast.success(`Loaded ${models.length} models.`);
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Could not load models.');
    } finally {
      setLoadingModels(false);
    }
  };

  useEffect(() => {
    if (hasKey) refreshModels(apiKey, true);
    else setListed([]);
    // Fetch once when the section mounts or the key changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasKey, apiKey]);

  const handleSave = () => {
    if (!draftKey.trim()) {
      toast.error('Paste an API key first.');
      return;
    }
    saveKey(draftKey);
    toast.success('Gemini API key saved on this device.');
  };

  const handleClear = () => {
    clearKey();
    setDraftKey('');
    setListed([]);
    toast.success('Gemini API key cleared.');
  };

  return (
    <section className="space-y-3">
      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
        <Sparkles size={14} /> Gemini API
      </h3>

      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-4 shadow-sm">
        <p className="text-[9px] text-slate-500 leading-relaxed">
          Optional. Paste your own Google AI Studio key. The key stays on this device; requests go only to Google. Copy/paste still works without a key.
        </p>

        <button
          type="button"
          onClick={() => setShowHowTo(v => !v)}
          className="w-full flex items-center justify-between text-[9px] font-black uppercase tracking-widest text-indigo-600"
        >
          How to get an API key
          <ChevronDown size={14} className={`transition-transform ${showHowTo ? 'rotate-180' : ''}`} />
        </button>
        {showHowTo && (
          <div className="space-y-2 rounded-xl bg-slate-50 border border-slate-100 p-3">
            <ol className="text-[9px] text-slate-500 leading-relaxed list-decimal pl-4 space-y-1">
              <li>Open <a className="text-indigo-600 font-bold underline" href="https://aistudio.google.com" target="_blank" rel="noreferrer">aistudio.google.com</a> and sign in.</li>
              <li>Open <strong>Get API key</strong> or go to <a className="text-indigo-600 font-bold underline" href="https://aistudio.google.com/api-keys" target="_blank" rel="noreferrer">API keys</a>.</li>
              <li>Click <strong>Create API key</strong>. Use a new project if asked. Free-tier usage does not require billing.</li>
              <li>Paste the key below. Treat it like a password.</li>
              <li>Optional: restrict the key to the Gemini API, and restrict HTTP referrers to this site.</li>
            </ol>
            <a
              href="https://aistudio.google.com/api-keys"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[9px] font-black uppercase text-indigo-600 hover:text-indigo-800"
            >
              <ExternalLink size={12} /> Open AI Studio API keys
            </a>
          </div>
        )}

        <div className="relative">
          <KeyRound size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type={showKey ? 'text' : 'password'}
            value={draftKey}
            onChange={(e) => setDraftKey(e.target.value)}
            placeholder={hasKey ? 'Key saved — paste to replace' : 'Paste Gemini API key'}
            className="w-full pl-8 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/20 font-mono"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setShowKey(v => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
          >
            {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
          </button>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 bg-indigo-600 text-white py-2.5 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2"
          >
            <Save size={14} /> Save Key
          </button>
          {hasKey && (
            <button
              type="button"
              onClick={handleClear}
              className="px-4 py-2.5 rounded-xl bg-red-50 text-red-600 text-[10px] font-black uppercase flex items-center justify-center gap-2"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <label className="text-[9px] font-black uppercase text-slate-400 tracking-widest">Model</label>
            <button
              type="button"
              onClick={() => refreshModels(apiKey, false)}
              disabled={!hasKey || loadingModels}
              className="text-[8px] font-black uppercase text-indigo-600 disabled:text-slate-300 flex items-center gap-1"
            >
              <RefreshCw size={10} className={loadingModels ? 'animate-spin' : ''} /> Refresh
            </button>
          </div>
          <select
            value={selectedModelId}
            onChange={(e) => setSelectedModelId(e.target.value)}
            disabled={!hasKey}
            className="w-full py-2.5 px-3 bg-slate-50 border border-slate-200 rounded-xl text-[10px] outline-none focus:ring-2 focus:ring-indigo-500/20 disabled:text-slate-400"
          >
            {options.map(model => (
              <option key={model.id} value={model.id}>
                {model.displayName} — {model.id}
              </option>
            ))}
          </select>
          <p className="text-[8px] text-slate-400 leading-relaxed">
            {hasKey
              ? missingSelected
                ? 'Saved model is not in the current Google list. A default will be applied after refresh.'
                : listed.length > 0
                  ? 'Cached on this device and refreshed from Google. Default is gemini-flash-latest when unset.'
                  : 'Using Flash/Pro latest aliases until the live list loads.'
              : 'Save an API key to load models from Google.'}
          </p>
        </div>
      </div>
    </section>
  );
};

export default GeminiSection;
