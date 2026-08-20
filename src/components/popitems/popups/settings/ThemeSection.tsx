"use client";

import React, { useState } from 'react';
import { Palette, Sparkles, Copy, Check, Save, Wand2, Trash2, Edit2, LayoutGrid, Info, Code, Save as SaveIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { type ThemeType, type ThemeColors, type ThemePatterns, type Theme, THEMES, type ThemePatternComplexity, buildThemePrompt } from '../../../../type';
import { generateGemini, stripMarkdownFences, readGeminiApiKey, readGeminiModelId } from '../../../../lib/gemini';
import { useGeminiSettings } from '../../../../hooks/useGeminiSettings';
import GeminiInput from '../../../ai/GeminiInput';
import GeminiModeTabs from '../../../ai/GeminiModeTabs';

interface ThemeSectionProps {
  activeTheme: ThemeType;
  setActiveTheme: (theme: ThemeType) => void;
  setCustomThemeColors: (colors: ThemeColors) => void;
  setCustomThemePatterns: (patterns: ThemePatterns) => void;
  savedCustomThemes: Theme[];
  saveCustomTheme: (name: string) => void;
  updateCustomTheme: (id: string, theme: Theme) => void;
  deleteCustomTheme: (id: string) => void;
  renameCustomTheme: (id: string, newName: string) => void;
  aiThemeInput: string;
  setAiThemeInput: (val: string) => void;
}

const ThemeSection: React.FC<ThemeSectionProps> = ({
  activeTheme, setActiveTheme, setCustomThemeColors, setCustomThemePatterns, savedCustomThemes, saveCustomTheme, updateCustomTheme, deleteCustomTheme, renameCustomTheme, aiThemeInput, setAiThemeInput
}) => {
  const [desiredStyle, setDesiredStyle] = useState('');
  const [patternType, setPatternType] = useState<ThemePatternComplexity>('none');
  const [copied, setCopied] = useState(false);
  const [showSaveTheme, setShowSaveTheme] = useState(false);
  const [themeName, setThemeName] = useState('');
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [jsonEditorId, setJsonEditorId] = useState<string | null>(null);
  const [jsonText, setJsonText] = useState('');
  const { hasKey } = useGeminiSettings();

  const copyPrompt = () => {
    navigator.clipboard.writeText(buildThemePrompt(desiredStyle, patternType));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('AI Prompt copied!');
  };

  const applyAiTheme = (rawJson?: string): boolean => {
    try {
      const cleanedInput = (rawJson ?? aiThemeInput).replace(/```json|```/g, '').trim();
      const themeData = JSON.parse(cleanedInput);
      
      let colors: any = {};
      let patterns: any = {};

      if (themeData.colors) {
        colors = themeData.colors;
        patterns = themeData.patterns || {};
      } else {
        const { patterns: p, ...rest } = themeData;
        colors = rest;
        patterns = p || {};
      }

      const required = ['bg', 'panel', 'header', 'accent', 'textOnBg', 'textOnPanel', 'border', 'muted'];
      const missing = required.filter(k => !colors[k]);
      
      if (missing.length > 0) {
        toast.error(`Incomplete JSON. Missing color properties: ${missing.join(', ')}`);
        return false;
      }

      if (!colors.text) colors.text = colors.textOnPanel;

      setCustomThemeColors(colors);
      setCustomThemePatterns(patterns);
      setActiveTheme('custom');
      setShowSaveTheme(true);
      toast.success('Theme Applied! Save it below to keep it.');
      return true;
    } catch (e) {
      toast.error('Invalid JSON format. Make sure you copied the full object.');
      return false;
    }
  };

  const handleSaveTheme = () => {
    if (themeName.trim()) {
      saveCustomTheme(themeName.trim());
      setThemeName('');
      setShowSaveTheme(false);
    } else {
      toast.error('Enter a theme name.');
    }
  };

  const handleStartRename = (theme: any) => {
    setEditingThemeId(theme.id);
    setEditName(theme.name);
  };

  const handleFinishRename = () => {
    if (editingThemeId && editName.trim()) {
      renameCustomTheme(editingThemeId, editName.trim());
      setEditingThemeId(null);
    }
  };

  const openJsonEditor = (theme: Theme) => {
    setJsonEditorId(theme.id);
    const editorData = {
      colors: theme.colors,
      patterns: theme.patterns || {}
    };
    setJsonText(JSON.stringify(editorData, null, 2));
  };

  const saveJsonEditor = () => {
    try {
      if (!jsonEditorId) return;
      const updatedData = JSON.parse(jsonText);
      const original = savedCustomThemes.find(t => t.id === jsonEditorId);
      if (!original) return;

      const updatedTheme: Theme = {
        ...original,
        colors: updatedData.colors || updatedData,
        patterns: updatedData.patterns || (updatedData.bg ? {} : original.patterns)
      };

      updateCustomTheme(jsonEditorId, updatedTheme);
      setJsonEditorId(null);
      toast.success('Theme JSON updated!');
    } catch (e) {
      toast.error('Invalid JSON syntax');
    }
  };

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
          <Palette size={14} /> Built-in Themes
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.values(THEMES)).map((theme) => (
            <button 
              key={theme.id}
              onClick={() => setActiveTheme(theme.id)}
              className={`p-3 rounded-xl border-2 transition-all text-left flex flex-col gap-2 ${activeTheme === theme.id ? 'border-blue-600 ring-2 ring-blue-100' : 'border-slate-100 hover:border-slate-200'}`}
            >
              <span className="text-[10px] font-black uppercase truncate">{theme.name}</span>
              <div className="flex gap-1">
                <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.bg }} />
                <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.header }} />
                <div className="w-3.5 h-3.5 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.accent }} />
              </div>
            </button>
          ))}
        </div>
      </section>

      {savedCustomThemes.length > 0 && (
        <section className="space-y-3">
          <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
            <Save size={14} /> Saved Custom Themes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedCustomThemes.map((theme) => (
              <div 
                key={theme.id}
                className={`p-3 rounded-xl border-2 transition-all flex flex-col gap-3 ${activeTheme === theme.id ? 'border-blue-600 bg-blue-50/30' : 'border-slate-100'}`}
              >
                <div className="flex items-center justify-between gap-3">
                  <button onClick={() => setActiveTheme(theme.id)} className="flex-1 flex flex-col gap-1.5 text-left min-w-0">
                    {editingThemeId === theme.id ? (
                      <input 
                        autoFocus
                        className="bg-white border border-blue-300 rounded px-1.5 py-0.5 text-[10px] font-black uppercase w-full outline-none"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        onBlur={handleFinishRename}
                        onKeyDown={(e) => e.key === 'Enter' && handleFinishRename()}
                      />
                    ) : (
                      <span className="text-[10px] font-black uppercase truncate">{theme.name}</span>
                    )}
                    <div className="flex gap-1">
                      <div className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.bg }} />
                      <div className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.header }} />
                      <div className="w-3 h-3 rounded-full border border-black/5" style={{ backgroundColor: theme.colors.accent }} />
                    </div>
                  </button>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => openJsonEditor(theme)} className="p-1.5 text-slate-400 hover:text-indigo-600 transition-colors" title="Edit JSON">
                      <Code size={12} />
                    </button>
                    <button onClick={() => handleStartRename(theme)} className="p-1.5 text-slate-400 hover:text-blue-600 transition-colors">
                      <Edit2 size={12} />
                    </button>
                    <button onClick={() => deleteCustomTheme(theme.id)} className="p-1.5 text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>

                {jsonEditorId === theme.id && (
                  <div className="space-y-2 pt-2 border-t border-slate-200">
                    <textarea 
                      className="w-full h-48 bg-slate-900 text-emerald-400 p-2 text-[9px] font-mono rounded-lg focus:ring-1 focus:ring-indigo-500 outline-none"
                      value={jsonText}
                      onChange={(e) => setJsonText(e.target.value)}
                    />
                    <div className="flex gap-2">
                      <button onClick={saveJsonEditor} className="flex-1 bg-indigo-600 text-white py-1.5 rounded-lg text-[9px] font-black uppercase flex items-center justify-center gap-1.5">
                        <SaveIcon size={10} /> Update JSON
                      </button>
                      <button onClick={() => setJsonEditorId(null)} className="flex-1 bg-slate-200 text-slate-600 py-1.5 rounded-lg text-[9px] font-black uppercase">
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="pt-6 border-t border-slate-100 space-y-4">
        <h3 className="text-[10px] font-black text-indigo-500 uppercase tracking-widest flex items-center gap-2">
          <Sparkles size={14} /> AI Theme Generator
        </h3>
        
        <div className="bg-slate-50 rounded-2xl p-4 space-y-4">
          <div className="space-y-3">
            <p className="text-[10px] text-slate-500 leading-relaxed italic">
              1. Choose LLM or Copy, set style/pattern, then generate or paste JSON.
            </p>

            <GeminiModeTabs
              middle={
                <div className="grid grid-cols-2 gap-2">
                  <div className="relative col-span-2">
                    <Wand2 size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Style (e.g. Royal Banquet, Deep Forest, Neon City...)" 
                      value={desiredStyle}
                      onChange={(e) => setDesiredStyle(e.target.value)}
                      className="w-full pl-8 pr-3 py-2.5 bg-white border border-slate-200 rounded-xl text-[10px] focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                  </div>
                  
                  <div className="flex bg-white border border-slate-200 rounded-xl p-0.5 col-span-2">
                    {(['none', 'subtle', 'decorative'] as const).map(p => (
                      <button
                        key={p}
                        onClick={() => setPatternType(p)}
                        className={`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${patternType === p ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-50'}`}
                      >
                        {p} Patterns
                      </button>
                    ))}
                  </div>
                </div>
              }
              apiPanel={
                <GeminiInput
                  hasKey={hasKey}
                  showTextarea={false}
                  requireInput={false}
                  generateLabel="Generate"
                  onGenerate={async ({ images }) => {
                    try {
                      const result = await generateGemini({
                        apiKey: readGeminiApiKey(),
                        model: readGeminiModelId(),
                        prompt: buildThemePrompt(desiredStyle, patternType),
                        images,
                        json: true,
                      });
                      const cleaned = stripMarkdownFences(result);
                      setAiThemeInput(cleaned);
                      applyAiTheme(cleaned);
                    } catch (err) {
                      toast.error(err instanceof Error ? err.message : 'Gemini request failed.');
                    }
                  }}
                />
              }
              copyPanel={
                <div className="space-y-2">
                  <ol className="text-[9px] text-slate-600 leading-relaxed list-decimal pl-4 space-y-1">
                    <li>Set style and pattern complexity above (optional: attach a mood photo in the chatbot).</li>
                    <li>Copy the designer prompt.</li>
                    <li>Paste into ChatGPT, Claude, or Gemini chat.</li>
                    <li>Paste the JSON into the box below, then Apply Preview.</li>
                  </ol>
                  <button onClick={copyPrompt} className="w-full py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase shadow-lg active:scale-95">
                    {copied ? <Check size={14} /> : <Copy size={14} />}
                    {copied ? 'Prompt Copied!' : 'Copy Designer Prompt'}
                  </button>
                </div>
              }
            />
          </div>

          <div className="space-y-3 pt-4 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-slate-500 leading-relaxed italic">
                2. Paste JSON from Copy mode (LLM generate applies automatically).
              </p>
              {patternType !== 'none' && (
                <span className="text-[8px] text-amber-600 font-bold uppercase flex items-center gap-1">
                  <LayoutGrid size={10} /> Complex SVG Generation Active
                </span>
              )}
            </div>
            <textarea 
              className="w-full h-32 bg-white border border-slate-200 rounded-xl p-3 text-[10px] font-mono focus:ring-2 focus:ring-indigo-500/20 outline-none resize-none transition-all"
              placeholder='Paste JSON here...'
              value={aiThemeInput}
              onChange={(e) => setAiThemeInput(e.target.value)}
            />
            
            {patternType !== 'none' && (
              <div className="p-2 bg-amber-50 border border-amber-100 rounded-lg flex items-start gap-2">
                <Info size={14} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[8px] text-amber-800 leading-normal">
                  SVG generation requires higher performance LLMs. If the pattern looks broken, try GPT-5, Gemini 2.0+, or Claude 3.5 Sonnet.
                </p>
              </div>
            )}

            <div className="p-2 bg-blue-50 border border-blue-100 rounded-lg flex items-start gap-2">
              <Info size={14} className="text-blue-600 shrink-0 mt-0.5" />
              <p className="text-[8px] text-blue-800 leading-normal">
                For further customization, please <del>argue</del> communicate directly with the LLM chatbot to refine colors, patterns, or add specific elements. 
                For complex patterns, suggest provide SVG code, by self-design orsearching from the web, to the LLM chatbot for further customization.
              </p>
            </div>
          </div>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={applyAiTheme}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl text-[10px] font-black uppercase shadow-md active:scale-95 transition-all"
            >
              Apply Preview
            </button>
            
            {showSaveTheme && (
              <div className="flex gap-2 animate-in fade-in slide-in-from-top-2 duration-300">
                <input 
                  type="text" 
                  placeholder="New Theme Name..." 
                  value={themeName} 
                  onChange={(e) => setThemeName(e.target.value)} 
                  className="flex-1 px-4 py-3 bg-white border-2 border-green-100 rounded-xl text-[10px] outline-none focus:border-green-400"
                />
                <button onClick={handleSaveTheme} className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-2 shadow-lg active:scale-95">
                  <Save size={14} /> Save Permanently
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default ThemeSection;