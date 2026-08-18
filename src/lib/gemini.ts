export const GEMINI_KEY_STORAGE = 'ct_secret_gemini_api_key';
export const GEMINI_MODEL_STORAGE = 'ct_gemini_model';
export const GEMINI_LIST_STORAGE = 'ct_gemini_model_list';
export const GEMINI_SETTINGS_EVENT = 'ct-gemini-settings';

export const GEMINI_DEFAULT_MODEL = 'gemini-flash-latest';

export const GEMINI_MODELS = {
  flash: 'gemini-flash-latest',
  pro: 'gemini-pro-latest',
} as const;

export interface GeminiListedModel {
  id: string;
  displayName: string;
}

export const GEMINI_FALLBACK_MODELS: GeminiListedModel[] = [
  { id: GEMINI_MODELS.flash, displayName: 'Gemini Flash (latest)' },
  { id: GEMINI_MODELS.pro, displayName: 'Gemini Pro (latest)' },
];

const LEGACY_MODEL_IDS = new Set([
  'flash',
  'pro',
  'gemini-2.5-flash',
  'gemini-2.5-pro',
]);

export interface GeminiModelInfo {
  name?: string;
  displayName?: string;
  baseModelId?: string;
  supportedGenerationMethods?: string[];
  supportedActions?: string[];
}

export interface GeminiImage {
  mimeType: string;
  data: string;
}

export class GeminiError extends Error {
  status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = 'GeminiError';
    this.status = status;
  }
}

export function notifyGeminiSettings() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event(GEMINI_SETTINGS_EVENT));
  }
}

export function normalizeModelId(name: unknown): string {
  return String(name ?? '').trim().replace(/^models\//i, '');
}

export function migrateStoredModelId(value: unknown): string {
  const id = normalizeModelId(value);
  if (!id || LEGACY_MODEL_IDS.has(id)) return GEMINI_DEFAULT_MODEL;
  return id;
}

export function readGeminiApiKey(): string {
  if (typeof localStorage === 'undefined') return '';
  return (localStorage.getItem(GEMINI_KEY_STORAGE) || '').trim();
}

export function readGeminiModelId(): string {
  if (typeof localStorage === 'undefined') return GEMINI_DEFAULT_MODEL;
  return migrateStoredModelId(localStorage.getItem(GEMINI_MODEL_STORAGE));
}

export function writeGeminiModelId(id: string): string {
  const next = migrateStoredModelId(id);
  localStorage.setItem(GEMINI_MODEL_STORAGE, next);
  return next;
}

export function loadCachedModelList(): GeminiListedModel[] {
  if (typeof localStorage === 'undefined') return [];
  try {
    const parsed = JSON.parse(localStorage.getItem(GEMINI_LIST_STORAGE) || '[]');
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((item) => ({
        id: normalizeModelId(item?.id),
        displayName: String(item?.displayName || item?.id || ''),
      }))
      .filter((item) => item.id);
  } catch {
    return [];
  }
}

export function saveCachedModelList(models: GeminiListedModel[]) {
  localStorage.setItem(GEMINI_LIST_STORAGE, JSON.stringify(models));
}

export function clearCachedModelList() {
  localStorage.removeItem(GEMINI_LIST_STORAGE);
}

export function pickDefaultModel(listed: GeminiListedModel[]): string {
  const ids = listed.map(model => model.id);
  if (ids.includes(GEMINI_MODELS.flash)) return GEMINI_MODELS.flash;
  if (ids.includes(GEMINI_MODELS.pro)) return GEMINI_MODELS.pro;
  const flash = listed.find(model => /flash/i.test(model.id));
  if (flash) return flash.id;
  return listed[0]?.id || GEMINI_DEFAULT_MODEL;
}

export function isGenerateContentModel(model: GeminiModelInfo): boolean {
  const methods = [
    ...(model.supportedGenerationMethods || []),
    ...(model.supportedActions || []),
  ];
  if (!methods.includes('generateContent')) return false;
  const id = normalizeModelId(model.name || model.baseModelId || '').toLowerCase();
  if (!id.startsWith('gemini')) return false;
  if (id.includes('embed') || id.includes('imagen') || id.includes('aqa')) return false;
  return true;
}

export function filterGenerateContentModels(models: GeminiModelInfo[]): GeminiListedModel[] {
  const seen = new Set<string>();
  const listed: GeminiListedModel[] = [];
  models.forEach((model) => {
    if (!isGenerateContentModel(model)) return;
    const id = normalizeModelId(model.name || model.baseModelId || '');
    if (!id || seen.has(id)) return;
    seen.add(id);
    listed.push({ id, displayName: model.displayName || id });
  });
  listed.sort((a, b) => a.displayName.localeCompare(b.displayName) || a.id.localeCompare(b.id));
  return listed;
}

export function mergeModelOptions(
  listed: GeminiListedModel[],
  selectedId: string,
  fallbacks: GeminiListedModel[] = GEMINI_FALLBACK_MODELS
): { options: GeminiListedModel[]; missingSelected: boolean } {
  const id = migrateStoredModelId(selectedId);
  const base = listed.length > 0 ? listed : fallbacks;
  const missingSelected = !base.some(model => model.id === id);
  const options = missingSelected ? [{ id, displayName: id }, ...base] : base;
  return { options, missingSelected };
}

export function stripMarkdownFences(text: string): string {
  const trimmed = text.trim();
  const wrapped = trimmed.match(/^```(?:json|bash|text|javascript)?\s*\r?\n?([\s\S]*?)\r?\n?```$/i);
  if (wrapped) return wrapped[1].trim();
  return trimmed.replace(/^```(?:json|bash|text|javascript)?\s*/i, '').replace(/\s*```$/i, '').trim();
}

export function parseGeminiJson<T>(text: string): T {
  const cleaned = stripMarkdownFences(text);
  const start = cleaned.indexOf('{');
  const end = cleaned.lastIndexOf('}');
  const candidate = start >= 0 && end > start ? cleaned.slice(start, end + 1) : cleaned;
  return JSON.parse(candidate) as T;
}

export function mapGeminiHttpError(status: number, bodyText: string): string {
  let detail = '';
  try {
    const parsed = JSON.parse(bodyText);
    detail = parsed?.error?.message || parsed?.message || '';
  } catch {
    detail = bodyText.slice(0, 180);
  }

  if (status === 400) return detail || 'Gemini rejected the request. Check the prompt or image.';
  if (status === 401 || status === 403) return 'Invalid Gemini API key. Update it in Settings.';
  if (status === 404) return `Model not found. Pick another model in Settings. ${detail}`.trim();
  if (status === 429) return 'Gemini quota exceeded. Wait and retry, or check AI Studio usage.';
  if (status >= 500) return 'Gemini is unavailable. Try again in a moment.';
  return detail || `Gemini request failed (${status}).`;
}

interface GenerateGeminiArgs {
  apiKey: string;
  model: string;
  prompt: string;
  images?: GeminiImage[];
  json?: boolean;
}

interface GeminiPart {
  text?: string;
  inlineData?: { mimeType: string; data: string };
}

export async function generateGemini({
  apiKey,
  model,
  prompt,
  images = [],
  json = false,
}: GenerateGeminiArgs): Promise<string> {
  const key = (apiKey || readGeminiApiKey()).trim();
  if (!key) throw new GeminiError('Add a Gemini API key in Settings.');
  const modelId = normalizeModelId(model || readGeminiModelId()) || GEMINI_DEFAULT_MODEL;

  const parts: GeminiPart[] = [{ text: prompt }];
  images.forEach((img) => {
    parts.push({ inlineData: { mimeType: img.mimeType, data: img.data } });
  });

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(modelId)}:generateContent`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': key,
      },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: json ? { responseMimeType: 'application/json' } : undefined,
      }),
    }
  );

  const bodyText = await res.text();
  if (!res.ok) throw new GeminiError(mapGeminiHttpError(res.status, bodyText), res.status);

  let data: { candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }> };
  try {
    data = JSON.parse(bodyText);
  } catch {
    throw new GeminiError('Gemini returned an unreadable response.');
  }

  const text = (data.candidates?.[0]?.content?.parts || [])
    .map((part) => part.text || '')
    .join('')
    .trim();

  if (!text) throw new GeminiError('Gemini returned an empty response.');
  return text;
}

export async function listGeminiModels(apiKey: string): Promise<GeminiListedModel[]> {
  const key = apiKey.trim();
  if (!key) throw new GeminiError('Add a Gemini API key in Settings.');

  const collected: GeminiModelInfo[] = [];
  let pageToken = '';
  let pages = 0;

  do {
    const url = new URL('https://generativelanguage.googleapis.com/v1beta/models');
    url.searchParams.set('pageSize', '50');
    if (pageToken) url.searchParams.set('pageToken', pageToken);

    const res = await fetch(url.toString(), {
      headers: { 'x-goog-api-key': key },
    });
    const bodyText = await res.text();
    if (!res.ok) throw new GeminiError(mapGeminiHttpError(res.status, bodyText), res.status);

    let data: { models?: GeminiModelInfo[]; nextPageToken?: string };
    try {
      data = JSON.parse(bodyText);
    } catch {
      throw new GeminiError('Gemini returned an unreadable model list.');
    }

    collected.push(...(data.models || []));
    pageToken = data.nextPageToken || '';
    pages += 1;
  } while (pageToken && pages < 20);

  const listed = filterGenerateContentModels(collected);
  saveCachedModelList(listed);
  return listed;
}
