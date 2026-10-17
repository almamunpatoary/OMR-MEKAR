import React from 'react';
import { OmrConfig, PRESETS, ColorScheme, SheetMode } from '../types/omr';
import {
  Printer,
  Sparkles,
  Users,
  Palette,
  FileText,
  Sliders,
  CheckCircle2,
  HelpCircle,
  RotateCcw,
  Eye,
  FileDown,
  Loader2,
} from 'lucide-react';

interface ControlPanelProps {
  config: OmrConfig;
  onChange: (newConfig: OmrConfig) => void;
  onPrint: () => void;
  onDownloadPdf: () => void;
  onOpenExportModal: () => void;
  onOpenBatchModal: () => void;
  batchCount: number;
  isExporting?: boolean;
  statusText?: string;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  config,
  onChange,
  onPrint,
  onDownloadPdf,
  onOpenExportModal,
  onOpenBatchModal,
  batchCount,
  isExporting = false,
  statusText = '',
}) => {
  const updateField = <K extends keyof OmrConfig>(key: K, value: OmrConfig[K]) => {
    onChange({ ...config, [key]: value });
  };

  const applyPreset = (presetConfig: Partial<OmrConfig>) => {
    onChange({
      ...config,
      ...presetConfig,
    });
  };

  return (
    <div className="w-full bg-white border-b md:border-b-0 md:border-r border-slate-200 flex flex-col h-full overflow-y-auto no-print text-slate-800">
      {/* App Branding & Action Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-900 text-white">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📄</span>
            <div>
              <h2 className="font-bold text-sm tracking-tight font-['Noto_Serif_Bengali']">
                বিডি ওএমআর শিট জেনারেটর
              </h2>
              <p className="text-[10px] text-slate-400">১-ক্লিকে আসল ওএমআর কভার শিট প্রস্তুতকারক</p>
            </div>
          </div>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-mono">
            A4 Ready
          </span>
        </div>

        {/* 1-Click Print & PDF Save Main Action Buttons */}
        <div className="space-y-2">
          {/* Main 1-Click Print & PDF Save (Opens Modal with Both Options) */}
          <button
            onClick={onOpenExportModal}
            className="w-full py-3 px-4 bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99] text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-900/30 flex items-center justify-center space-x-2 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4 text-white" />
            <span>১ ক্লিকে প্রিন্ট / পিডিএফ সংরক্ষণ</span>
          </button>

          {/* Quick Direct Buttons Row: Direct Print + Direct PDF */}
          <div className="grid grid-cols-2 gap-1.5">
            <button
              onClick={onPrint}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              title="সরাসরি প্রিন্ট ডায়ালগ ওপেন করুন"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>সরাসরি প্রিন্ট</span>
            </button>

            <button
              onClick={onDownloadPdf}
              disabled={isExporting}
              className="py-2 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 active:scale-[0.99] text-amber-400 hover:text-amber-300 font-semibold text-[11px] rounded-xl border border-slate-700 flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              title="A4 PDF ফাইল সরাসরি ডাউনলোড করুন"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>প্রস্তুত হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5" />
                  <span>PDF ডাউনলোড</span>
                </>
              )}
            </button>
          </div>
        </div>

        <p className="text-[10px] text-slate-400 text-center mt-2">
          {config.isBatchMode
            ? `⚡ ব্যাচ মোড: মোট ${batchCount} টি আলাদা রোল সহ খাতা রেডি`
            : '⚡ একক কপি মোড: ফটোকপি বা মূল খাতার জন্য পারফেক্ট'}
        </p>
      </div>

      <div className="p-4 space-y-5 flex-1">
        {/* 1. Instant 1-Click Presets */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>১-ক্লিক টেমপ্লেট ও প্রিসেট</span>
            </label>
          </div>
          <div className="space-y-1.5">
            {PRESETS.map((preset) => {
              const isActive =
                config.boardName === preset.config.boardName &&
                config.sheetMode === (preset.config.sheetMode || 'board_cover');

              return (
                <button
                  key={preset.id}
                  onClick={() => applyPreset(preset.config)}
                  className={`w-full text-left p-2.5 rounded-xl border text-xs transition-all flex items-start space-x-2 ${
                    isActive
                      ? 'border-emerald-500 bg-emerald-50/70 text-slate-900 shadow-xs ring-1 ring-emerald-500/30'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <CheckCircle2
                    className={`w-4 h-4 mt-0.5 flex-shrink-0 ${
                      isActive ? 'text-emerald-600' : 'text-slate-300'
                    }`}
                  />
                  <div>
                    <div className="font-bold leading-tight">{preset.label}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                      {preset.desc}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. Sheet Type Mode */}
        <div>
          <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 mb-2">
            <FileText className="w-3.5 h-3.5 text-blue-500" />
            <span>শিটের ধরন (Sheet Format)</span>
          </label>
          <div className="grid grid-cols-2 gap-1.5 bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => updateField('sheetMode', 'board_cover')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg text-center transition-all ${
                config.sheetMode === 'board_cover'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              বোর্ড উত্তরপত্র কভার শিট
            </button>
            <button
              onClick={() => updateField('sheetMode', 'mcq_only')}
              className={`py-2 px-2 text-xs font-semibold rounded-lg text-center transition-all ${
                config.sheetMode === 'mcq_only'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              এমসিকিউ ওএমআর শিট
            </button>
          </div>
        </div>

        {/* 3. Batch Roll Generation */}
        <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3">
          <div className="flex items-center justify-between mb-1.5">
            <div className="flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-amber-700" />
              <span className="text-xs font-bold text-amber-950">এক ক্লিকে একাধিক কপি (ব্যাচ)</span>
            </div>
            {config.isBatchMode && (
              <span className="text-[9px] bg-amber-600 text-white px-1.5 py-0.2 rounded font-bold">
                {batchCount} কপি
              </span>
            )}
          </div>
          <p className="text-[10px] text-amber-800 leading-snug mb-2.5">
            রোল নম্বর ১, ২, ৩... বা স্টুডেন্ট লিস্ট অনুযায়ী এক ক্লিকে পুরো ক্লাসের জন্য রোল সহ খাতা জেনারেট করুন।
          </p>
          <div className="flex items-center space-x-2">
            <button
              onClick={onOpenBatchModal}
              className="flex-1 py-1.5 px-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center justify-center space-x-1 transition-all"
            >
              <span>রোল রেঞ্জ সেট করুন</span>
            </button>
            {config.isBatchMode && (
              <button
                onClick={() => updateField('isBatchMode', false)}
                className="py-1.5 px-2 bg-white hover:bg-slate-100 text-slate-700 border border-slate-300 text-xs rounded-lg transition-all"
                title="একক কপি মোডে ফিরুন"
              >
                রিসেট
              </button>
            )}
          </div>
        </div>

        {/* 4. Color Theme Selection */}
        <div>
          <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5 mb-2">
            <Palette className="w-3.5 h-3.5 text-purple-500" />
            <span>কালার থিম (কালার বা ফটোকপি ফ্রেন্ডলি)</span>
          </label>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'maroon', label: 'আসল মেরুন ওএমআর', color: '#881337', badge: 'অফিসিয়াল' },
              { id: 'black', label: 'কালো ও সাদা', color: '#111827', badge: 'জেরক্স ফ্রেন্ডলি' },
              { id: 'blue', label: 'রয়্যাল ব্লু', color: '#1e3a8a', badge: 'পরীক্ষা' },
              { id: 'green', label: 'ফরেস্ট গ্রিন', color: '#14532d', badge: 'মাদ্রাসা' },
            ].map((theme) => {
              const isSelected = config.colorScheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => updateField('colorScheme', theme.id as ColorScheme)}
                  className={`p-2 rounded-xl border text-left flex items-center space-x-2 transition-all ${
                    isSelected
                      ? 'border-slate-800 bg-slate-50 ring-1 ring-slate-800'
                      : 'border-slate-200 bg-white hover:bg-slate-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded-full border border-black/20 flex-shrink-0"
                    style={{ backgroundColor: theme.color }}
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-bold truncate leading-tight">{theme.label}</div>
                    <div className="text-[9px] text-slate-500">{theme.badge}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* 5. Customization Fields */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          <label className="text-xs font-bold text-slate-900 flex items-center space-x-1.5">
            <Sliders className="w-3.5 h-3.5 text-slate-600" />
            <span>কাস্টম তথ্য পরিবর্তন</span>
          </label>

          {/* Board Name */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              বোর্ড বা প্রতিষ্ঠানের নাম
            </label>
            <input
              type="text"
              value={config.boardName}
              onChange={(e) => updateField('boardName', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 font-semibold"
              placeholder="যেমন: বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড, ঢাকা"
            />
          </div>

          {/* Exam Name & Year */}
          <div className="grid grid-cols-3 gap-2">
            <div className="col-span-2">
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                পরীক্ষার নাম
              </label>
              <input
                type="text"
                value={config.examName}
                onChange={(e) => updateField('examName', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500"
                placeholder="জেডিসি/দাখিল/আলিম পরীক্ষা"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                পরীক্ষার সাল
              </label>
              <input
                type="text"
                value={config.examYear}
                onChange={(e) => updateField('examYear', e.target.value)}
                className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs text-center font-semibold focus:ring-2 focus:ring-emerald-500"
                placeholder="যেমন: ২০২৬"
              />
            </div>
          </div>

          {/* Watermark text */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">ওয়াটারমার্ক লেখা</label>
              <label className="flex items-center space-x-1 text-[10px] text-slate-500 cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.showWatermark}
                  onChange={(e) => updateField('showWatermark', e.target.checked)}
                  className="rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span>প্রদর্শন</span>
              </label>
            </div>
            <input
              type="text"
              value={config.watermarkText}
              onChange={(e) => updateField('watermarkText', e.target.value)}
              disabled={!config.showWatermark}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs disabled:bg-slate-100 disabled:text-slate-400 focus:ring-2 focus:ring-emerald-500"
              placeholder="মাদ্রাসা / ঢাকা বোর্ড"
            />
          </div>

          {/* Invigilator signature title */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              স্বাক্ষর বক্সের পদবি (ইনভিজিলেটর)
            </label>
            <input
              type="text"
              value={config.invigilatorTitle}
              onChange={(e) => updateField('invigilatorTitle', e.target.value)}
              className="w-full px-2.5 py-1.5 border border-slate-300 rounded-lg text-xs focus:ring-2 focus:ring-emerald-500 font-medium"
              placeholder="কক্ষ পরিদর্শকের স্বাক্ষর"
            />
          </div>
          {config.sheetMode === 'mcq_only' && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                এমসিকিউ প্রশ্নের সংখ্যা
              </label>
              <div className="grid grid-cols-4 gap-1.5">
                {[20, 25, 30, 50].map((qty) => (
                  <button
                    key={qty}
                    onClick={() => updateField('mcqCount', qty)}
                    className={`py-1 text-xs font-bold rounded-lg border ${
                      config.mcqCount === qty
                        ? 'bg-emerald-600 text-white border-emerald-600'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {qty} টি
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Additional Toggles */}
          <div className="pt-2 border-t border-slate-100 space-y-2">
            <label className="flex items-center justify-between text-xs font-semibold text-emerald-800 bg-emerald-50/80 p-2 rounded-lg border border-emerald-200 cursor-pointer">
              <span className="flex items-center space-x-1.5">
                <span>✍️</span>
                <span>হাতে লেখার জন্য সব ঘর ফাঁকা রাখুন (Blank)</span>
              </span>
              <input
                type="checkbox"
                checked={config.blankBoxesForHandwriting}
                onChange={(e) => updateField('blankBoxesForHandwriting', e.target.checked)}
                className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
              <span>বারকোড ও কিউআর কোড (QR)</span>
              <input
                type="checkbox"
                checked={config.showBarcode && config.showQrCode}
                onChange={(e) => {
                  updateField('showBarcode', e.target.checked);
                  updateField('showQrCode', e.target.checked);
                }}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>

            {config.sheetMode === 'board_cover' && (
              <>
                <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                  <span>নিচের অংশ (উত্তরপত্রের অংশ / পরীক্ষক সেকশন)</span>
                  <input
                    type="checkbox"
                    checked={config.showBottomSection}
                    onChange={(e) => updateField('showBottomSection', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>

                {config.showBottomSection && (
                  <div className="bg-slate-50 p-2 rounded-lg border border-slate-200 mt-1 space-y-1.5">
                    <span className="text-[11px] font-bold text-slate-700 block">নিচের অংশের লেআউট:</span>
                    <div className="grid grid-cols-1 gap-1">
                      <button
                        type="button"
                        onClick={() => updateField('bottomSectionType', 'question_grid')}
                        className={`text-left px-2 py-1.5 text-[11px] rounded border font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          config.bottomSectionType === 'question_grid'
                            ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>📋 প্রশ্ন ১-২০ নম্বর মূল্যায়ন গ্রিড (নতুন ছবি)</span>
                        {config.bottomSectionType === 'question_grid' && <span className="text-rose-600 font-bold">✓</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField('bottomSectionType', 'bubble_grid')}
                        className={`text-left px-2 py-1.5 text-[11px] rounded border font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          config.bottomSectionType === 'bubble_grid'
                            ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>⭕ ওএমআর বৃত্তযুক্ত পরীক্ষক সেকশন</span>
                        {config.bottomSectionType === 'bubble_grid' && <span className="text-rose-600 font-bold">✓</span>}
                      </button>

                      <button
                        type="button"
                        onClick={() => updateField('bottomSectionType', 'both')}
                        className={`text-left px-2 py-1.5 text-[11px] rounded border font-semibold flex items-center justify-between transition-all cursor-pointer ${
                          config.bottomSectionType === 'both'
                            ? 'bg-rose-50 border-rose-400 text-rose-950 shadow-xs'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <span>📑 উভয় সেকশন একসাথে</span>
                        {config.bottomSectionType === 'both' && <span className="text-rose-600 font-bold">✓</span>}
                      </button>
                    </div>

                    {(config.bottomSectionType === 'question_grid' || config.bottomSectionType === 'both') && (
                      <div className="flex items-center justify-between pt-1 border-t border-slate-200 text-[10px]">
                        <span className="text-slate-600 font-medium">প্রশ্ন নম্বর সংখ্যা পদ্ধতি:</span>
                        <div className="flex space-x-1">
                          <button
                            type="button"
                            onClick={() => updateField('questionNumeralType', 'english')}
                            className={`px-1.5 py-0.5 rounded border font-mono ${
                              config.questionNumeralType === 'english'
                                ? 'bg-slate-800 text-white border-slate-800 font-bold'
                                : 'bg-white text-slate-700 border-slate-300'
                            }`}
                          >
                            1, 2, 3..
                          </button>
                          <button
                            type="button"
                            onClick={() => updateField('questionNumeralType', 'bengali')}
                            className={`px-1.5 py-0.5 rounded border ${
                              config.questionNumeralType === 'bengali'
                                ? 'bg-slate-800 text-white border-slate-800 font-bold'
                                : 'bg-white text-slate-700 border-slate-300'
                            }`}
                          >
                            ১, ২, ৩..
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer">
                  <span>মাঝের পারফোরেশন কাটিং লাইন</span>
                  <input
                    type="checkbox"
                    checked={config.showPerforation}
                    onChange={(e) => updateField('showPerforation', e.target.checked)}
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                </label>
              </>
            )}

            <label className="flex items-center justify-between text-xs text-slate-700 cursor-pointer pt-1">
              <span className="flex items-center space-x-1">
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>নমুনা ভরাট প্রদর্শন (Demo Fill)</span>
              </span>
              <input
                type="checkbox"
                checked={config.prefillBubbles}
                onChange={(e) => updateField('prefillBubbles', e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
            </label>
          </div>
        </div>

        {/* Printing Tips Guide */}
        <div className="bg-slate-50 rounded-xl p-3 border border-slate-200 text-[11px] text-slate-600 space-y-1">
          <div className="font-bold text-slate-900 flex items-center space-x-1">
            <HelpCircle className="w-3.5 h-3.5 text-blue-500" />
            <span>প্রিন্ট করার সঠিক নিয়ম:</span>
          </div>
          <p>• পেপার সাইজ: <b>A4</b> সিলেক্ট করুন।</p>
          <p>• মার্জিন: <b>None বা Minimum</b> রাখুন।</p>
          <p>• স্কেল: <b>100% (Default)</b> রাখুন।</p>
          <p>• ব্যাকগ্রাউন্ড গ্রাফিক্স (Background graphics) অন রাখুন।</p>
        </div>
      </div>
    </div>
  );
};
