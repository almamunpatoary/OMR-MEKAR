import React from 'react';
import {
  X,
  FileDown,
  Printer,
  Image as ImageIcon,
  Loader2,
  CheckCircle2,
  HelpCircle,
  Sparkles,
} from 'lucide-react';

interface PrintDownloadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onDownloadPdf: () => Promise<void>;
  onDownloadImage: () => Promise<void>;
  onTriggerPrint: () => void;
  isProcessing: boolean;
  statusText: string;
  sheetTitle: string;
}

export const PrintDownloadModal: React.FC<PrintDownloadModalProps> = ({
  isOpen,
  onClose,
  onDownloadPdf,
  onDownloadImage,
  onTriggerPrint,
  isProcessing,
  statusText,
  sheetTitle,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-tight">প্রিন্ট ও ডাউনলোড অপশন</h3>
              <p className="text-[11px] text-slate-300">সরাসরি প্রিন্ট করুন অথবা ১০০% নিখুঁত PDF সেভ করুন</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="p-1.5 rounded-lg hover:bg-slate-700/60 text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Processing State Indicator */}
        {isProcessing && (
          <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-3 flex items-center space-x-3 text-emerald-800">
            <Loader2 className="w-5 h-5 animate-spin text-emerald-600 flex-shrink-0" />
            <div className="text-xs font-semibold">
              <span>{statusText || 'ফাইল প্রস্তুত হচ্ছে, অনুগ্রহ করে অপেক্ষা করুন...'}</span>
            </div>
          </div>
        )}

        {/* Options Body */}
        <div className="p-6 space-y-3.5">
          <p className="text-xs text-slate-600">
            আপনার শিটটি (<b className="text-slate-800">{sheetTitle}</b>) প্রিন্ট অথবা ডাউনলোড করার জন্য নিচের অপশনটি বেছে নিন:
          </p>

          <div className="space-y-3">
            {/* 1. Direct Print in Page */}
            <button
              onClick={() => {
                onTriggerPrint();
              }}
              disabled={isProcessing}
              className="w-full p-3.5 rounded-xl border-2 border-emerald-600 bg-emerald-600 hover:bg-emerald-700 active:scale-[0.99] transition-all flex items-center space-x-3.5 cursor-pointer text-white shadow-md text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center flex-shrink-0">
                <Printer className="w-5 h-5 text-white" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-sm flex items-center justify-between">
                  <span>১. সরাসরি প্রিন্ট করুন (Direct Print)</span>
                  <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded font-mono">সুপার ফাস্ট</span>
                </div>
                <div className="text-[11px] text-emerald-100 mt-0.5 leading-tight">
                  ক্লিক করলেই ব্রাউজারের আসল প্রিন্ট ডায়ালগ ওপেন হবে। প্রিন্টার সিলেক্ট করে প্রিন্ট দিন।
                </div>
              </div>
            </button>

            {/* 2. Download High-Res PDF Button (Guaranteed Bengali font rendering) */}
            <button
              onClick={onDownloadPdf}
              disabled={isProcessing}
              className="w-full p-3.5 rounded-xl border border-slate-300 bg-slate-50 hover:bg-blue-50 hover:border-blue-400 active:scale-[0.99] transition-all flex items-center space-x-3.5 cursor-pointer text-left group"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center flex-shrink-0">
                <FileDown className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs text-slate-900 group-hover:text-blue-950 flex items-center space-x-1.5">
                  <span>২. পিডিএফ (PDF) ডাউনলোড করুন</span>
                  <span className="text-[9px] bg-blue-100 text-blue-800 px-1.5 py-0.2 rounded font-semibold">
                    A4 সাইজ (নিখুঁত বাংলা ফন্ট)
                  </span>
                </div>
                <div className="text-[10px] text-slate-500 mt-0.5 leading-snug">
                  আসল বাংলা ফন্ট এমবেডেড করা—লেখা এলোমেলো হবে না। ডিভাইসে সংরক্ষণ করে যেকোনো সময় প্রিন্ট দিন।
                </div>
              </div>
            </button>

            {/* 3. Download PNG Image Button */}
            <button
              onClick={onDownloadImage}
              disabled={isProcessing}
              className="w-full p-3 rounded-xl border border-slate-200 bg-white hover:bg-purple-50 hover:border-purple-300 active:scale-[0.99] transition-all flex items-center space-x-3 cursor-pointer text-left group"
            >
              <div className="w-9 h-9 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center flex-shrink-0">
                <ImageIcon className="w-4 h-4" />
              </div>
              <div className="flex-1">
                <div className="font-bold text-xs text-slate-800 group-hover:text-purple-950">
                  ৩. ছবি (PNG) ডাউনলোড করুন
                </div>
                <div className="text-[10px] text-slate-500">
                  উচ্চ রেজোলিউশন ৩00 DPI ক্লিয়ার ছবি ফাইল হিসেবে সংরক্ষণ করুন।
                </div>
              </div>
            </button>
          </div>

          {/* Quick Notice */}
          <div className="bg-slate-100 rounded-xl p-3 text-[11px] text-slate-600 flex items-start space-x-2">
            <HelpCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <b>টিপস:</b> ব্রাউজারে কাগজের সাইজ <b>A4</b> এবং মার্জিন <b>None (বা Default)</b> সিলেক্ট করে প্রিন্ট দিন অথবা <b>PDF ডাউনলোড</b> করে যে কোনো সফটওয়্যার দিয়ে ১০০% সাইজে প্রিন্ট করুন।
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            disabled={isProcessing}
            className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
