import { describe, it, expect } from 'vitest';
import { stripMarkdownFences, parseGeminiJson, mapGeminiHttpError, GEMINI_KEY_STORAGE, GEMINI_LIST_STORAGE, GEMINI_DEFAULT_MODEL, GEMINI_MODELS, normalizeModelId, migrateStoredModelId, filterGenerateContentModels, mergeModelOptions, pickDefaultModel } from './gemini';
import { extractBase64FromDataUrl } from './imageInput';

describe('stripMarkdownFences', () => {
  it('unwraps fenced json', () => {
    expect(stripMarkdownFences('```json\n{"a":1}\n```')).toBe('{"a":1}');
  });

  it('unwraps fenced bash', () => {
    expect(stripMarkdownFences('```bash\nTownsfolk:\nChef\n```')).toBe('Townsfolk:\nChef');
  });

  it('returns plain text unchanged', () => {
    expect(stripMarkdownFences('  hello  ')).toBe('hello');
  });
});

describe('parseGeminiJson', () => {
  it('parses json inside extra prose and fences', () => {
    const raw = 'Sure.\n```json\n{"bg":"#111","names":["Ada"]}\n```\n';
    expect(parseGeminiJson<{ bg: string }>(raw)).toEqual({ bg: '#111', names: ['Ada'] });
  });
});

describe('mapGeminiHttpError', () => {
  it('maps auth and quota statuses', () => {
    expect(mapGeminiHttpError(403, '')).toMatch(/Invalid Gemini API key/i);
    expect(mapGeminiHttpError(429, '')).toMatch(/quota/i);
    expect(mapGeminiHttpError(404, '{"error":{"message":"model xyz"}}')).toMatch(/Model not found/i);
  });
});

describe('secret storage', () => {
  it('does not use the ct_app_config prefix so config export cannot include the key', () => {
    expect(GEMINI_KEY_STORAGE.startsWith('ct_app_config')).toBe(false);
    expect(GEMINI_KEY_STORAGE).toBe('ct_secret_gemini_api_key');
    expect(GEMINI_LIST_STORAGE.startsWith('ct_app_config')).toBe(false);
    expect(GEMINI_LIST_STORAGE).toBe('ct_gemini_model_list');
  });
});

describe('model id helpers', () => {
  it('strips models/ prefix', () => {
    expect(normalizeModelId('models/gemini-2.5-flash')).toBe('gemini-2.5-flash');
    expect(normalizeModelId('gemini-2.5-pro')).toBe('gemini-2.5-pro');
  });

  it('migrates legacy flash/pro and 2.5 ids to gemini-flash-latest', () => {
    expect(migrateStoredModelId('flash')).toBe(GEMINI_DEFAULT_MODEL);
    expect(migrateStoredModelId('pro')).toBe(GEMINI_DEFAULT_MODEL);
    expect(migrateStoredModelId('gemini-2.5-pro')).toBe(GEMINI_DEFAULT_MODEL);
    expect(migrateStoredModelId('models/gemini-3.5-flash')).toBe('gemini-3.5-flash');
    expect(migrateStoredModelId('')).toBe(GEMINI_DEFAULT_MODEL);
  });

  it('picks Google latest aliases as default', () => {
    expect(pickDefaultModel([
      { id: 'gemini-3.5-flash', displayName: '3.5 Flash' },
      { id: 'gemini-flash-latest', displayName: 'Flash latest' },
    ])).toBe(GEMINI_MODELS.flash);
    expect(pickDefaultModel([
      { id: 'gemini-3.1-pro-preview', displayName: '3.1 Pro' },
    ])).toBe('gemini-3.1-pro-preview');
    expect(pickDefaultModel([
      { id: 'gemini-3.5-pro', displayName: '3.5 Pro' },
      { id: 'gemini-3.5-flash', displayName: '3.5 Flash' },
    ])).toBe('gemini-3.5-flash');
  });

  it('keeps generateContent gemini models and drops embed/imagen', () => {
    const listed = filterGenerateContentModels([
      { name: 'models/gemini-2.5-flash', displayName: 'Gemini 2.5 Flash', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/embedding-001', displayName: 'Embedding', supportedGenerationMethods: ['embedContent'] },
      { name: 'models/gemini-embedding-exp', displayName: 'Gemini Embedding', supportedGenerationMethods: ['generateContent', 'embedContent'] },
      { name: 'models/imagen-3.0-generate', displayName: 'Imagen', supportedGenerationMethods: ['generateContent'] },
      { name: 'models/gemini-2.5-pro', displayName: 'Gemini 2.5 Pro', supportedActions: ['generateContent'] },
    ]);
    expect(listed.map(m => m.id)).toEqual(['gemini-2.5-flash', 'gemini-2.5-pro']);
  });

  it('merges fallbacks and treats migrated 2.5 ids as latest', () => {
    const empty = mergeModelOptions([], 'gemini-2.5-flash');
    expect(empty.missingSelected).toBe(false);
    expect(empty.options.some(m => m.id === GEMINI_MODELS.flash)).toBe(true);

    const retired = mergeModelOptions(
      [{ id: 'gemini-3-flash', displayName: 'Gemini 3 Flash' }],
      'gemini-2.5-pro'
    );
    expect(retired.missingSelected).toBe(true);
    expect(retired.options[0].id).toBe(GEMINI_DEFAULT_MODEL);
  });
});

describe('extractBase64FromDataUrl', () => {
  it('splits mime and payload', () => {
    expect(extractBase64FromDataUrl('data:image/jpeg;base64,abc123')).toEqual({
      mimeType: 'image/jpeg',
      data: 'abc123',
    });
  });

  it('rejects invalid urls', () => {
    expect(() => extractBase64FromDataUrl('not-a-data-url')).toThrow();
  });
});
