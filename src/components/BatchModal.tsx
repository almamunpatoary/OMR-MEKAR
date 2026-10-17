import React, { useState } from 'react';
import { BatchStudent } from '../types/omr';
import { X, Users, Sparkles, Check } from 'lucide-react';

interface BatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyBatch: (students: BatchStudent[]) => void;
  initialRoll: number;
  initialReg: number;
  initialSerial: number;
}

export const BatchModal: React.FC<BatchModalProps> = ({
  isOpen,
  onClose,
  onApplyBatch,
  initialRoll,
  initialReg,
  initialSerial,
}) => {
  const [mode, setMode] = useState<'range' | 'paste'>('range');
  const [count, setCount] = useState<number>(20);
  const [startRoll, setStartRoll] = useState<number>(initialRoll);
  const [startReg, setStartReg] = useState<number>(initialReg);
  const [startSerial, setStartSerial] = useState<number>(initialSerial);
  const [pastedText, setPastedText] = useState<string>(
    '100001, 1912456701, মো: আব্দুল্লাহ\n100002, 1912456702, ফাতেমা খাতুন\n100003, 1912456703, তানভীর আহমেদ\n100004, 1912456704, সুমাইয়া আক্তার\n100005, 1912456705, সাব্বির রহমান'
  );

  if (!isOpen) return null;

  const handleGenerate = () => {
    const list: BatchStudent[] = [];

    if (mode === 'range') {
      for (let i = 0; i < count; i++) {
        list.push({
          roll: (startRoll + i).toString(),
          reg: (startReg + i).toString(),
          serial: (startSerial + i).toString(),
          name: `শিক্ষার্থী #${i + 1}`,
        });
      }
    } else {
      const lines = pastedText.split('\n');
      let serialCounter = startSerial;

      lines.forEach((line) => {
        const parts = line.split(/[,\t]+/).map((s) => s.trim()).filter(Boolean);
        if (parts.length >= 1) {
          const roll = parts[0] || '';
          const reg = parts[1] || '';
          const name = parts[2] || '';
          list.push({
            roll,
            reg,
            name,
            serial: serialCounter.toString(),
          });
          serialCounter++;
        }
      });
    }

    onApplyBatch(list);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 no-print">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full border border-slate-200 overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <Users className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base">১-ক্লিকে রোল নম্বর সহ ব্যাচ ওএমআর জেনারেটর</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-600">
            এক ক্লিকে আপনার পুরো ক্লাসের বা কেন্দ্রের সকল পরীক্ষার্থীর জন্য আলাদা আলাদা রোল, রেজিস্ট্রেশন ও বারকোড সহ ওএমআর শিট স্বয়ংক্রিয়ভাবে তৈরি করুন।
          </p>

          {/* Mode switch */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            <button
              onClick={() => setMode('range')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'range'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              স্বয়ংক্রিয় রোল রেঞ্জ (Roll Range)
            </button>
            <button
              onClick={() => setMode('paste')}
              className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all ${
                mode === 'paste'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              রোল লিস্ট পেস্ট করুন (Excel / Text)
            </button>
          </div>

          {mode === 'range' ? (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">মোট খাতার সংখ্যা (কপি)</label>
                <input
                  type="number"
                  min="1"
                  max="200"
                  value={count}
                  onChange={(e) => setCount(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">শুরুর রোল নম্বর</label>
                <input
                  type="number"
                  value={startRoll}
                  onChange={(e) => setStartRoll(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">শুরুর রেজিস্ট্রেশন নম্বর</label>
                <input
                  type="number"
                  value={startReg}
                  onChange={(e) => setStartReg(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">খাতার প্রারম্ভিক সিরিয়াল</label>
                <input
                  type="number"
                  value={startSerial}
                  onChange={(e) => setStartSerial(parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">
                রোল, রেজিস্ট্রেশন ও নাম প্রতি লাইনে কমা দিয়ে লিখুন বা এক্সেল থেকে কপি পেস্ট করুন:
              </label>
              <textarea
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full p-2.5 border rounded-lg font-mono text-xs focus:ring-2 focus:ring-emerald-500"
                placeholder="100001, 1912456701, রহিম"
              />
            </div>
          )}

          {/* Quick presets buttons */}
          <div className="flex items-center space-x-2 pt-2 border-t">
            <span className="text-xs text-slate-500 font-medium">দ্রুত রেঞ্জ:</span>
            {[10, 25, 50, 100].map((qty) => (
              <button
                key={qty}
                type="button"
                onClick={() => {
                  setMode('range');
                  setCount(qty);
                }}
                className={`text-xs px-2.5 py-1 rounded-md border ${
                  count === qty && mode === 'range'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-700 font-bold'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                {qty} টি খাতা
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="bg-slate-50 px-6 py-3.5 flex items-center justify-between border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900"
          >
            বাতিল
          </button>
          <button
            onClick={handleGenerate}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-md flex items-center space-x-2 transition-all cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>১-ক্লিকে শিট তৈরি করুন</span>
          </button>
        </div>
      </div>
    </div>
  );
};
