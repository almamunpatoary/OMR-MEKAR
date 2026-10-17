import React from 'react';
import { OmrConfig, BatchStudent } from '../types/omr';
import { getColorPalette, toBengaliNumber } from '../utils/omrStyles';
import { BoardEmblem } from './BoardEmblem';
import { OmrTimingBar } from './OmrTimingBar';
import { OmrBubbleMatrix } from './OmrBubbleMatrix';
import { BarcodeRenderer } from './BarcodeRenderer';
import { QrCodeRenderer } from './QrCodeRenderer';

interface McqOmrSheetProps {
  config: OmrConfig;
  student?: BatchStudent;
  pageIndex?: number;
}

export const McqOmrSheet: React.FC<McqOmrSheetProps> = ({
  config,
  student,
  pageIndex = 0,
}) => {
  const palette = getColorPalette(config.colorScheme);

  const currentSerial = student?.serial || (
    config.isBatchMode
      ? (config.startSerial + pageIndex).toString()
      : config.serialNumber
  );

  const currentRoll = config.blankBoxesForHandwriting
    ? ''
    : (student?.roll || (config.isBatchMode ? (config.startRoll + pageIndex).toString() : ''));

  const currentReg = config.blankBoxesForHandwriting
    ? ''
    : (student?.reg || (config.isBatchMode ? (config.startReg + pageIndex).toString() : ''));

  const currentSubjectCode = config.blankBoxesForHandwriting
    ? ''
    : (student?.subjectCode || '');

  const optionLabels = config.mcqOptionType === 'bengali'
    ? ['ক', 'খ', 'গ', 'ঘ']
    : ['A', 'B', 'C', 'D'];

  const emblemType = config.boardName.includes('মাদ্রাসা')
    ? 'madrasah'
    : config.boardName.includes('স্কুল') || config.boardName.includes('মডেল')
    ? 'school'
    : 'general';

  // Questions division into columns
  const questionsPerCol = config.mcqCount <= 30 ? 15 : 25;
  const colCount = Math.ceil(config.mcqCount / questionsPerCol);

  return (
    <div
      className="omr-sheet-paper bg-white text-slate-900 border border-slate-300 shadow-xl print:border-none print:shadow-none mx-auto relative select-none"
      style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '6mm 7mm 6mm 7mm',
        boxSizing: 'border-box',
      }}
    >
      {/* Black Optical Timing Squares */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-black" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-black" />

      {/* Watermark */}
      {config.showWatermark && config.watermarkText && (
        <div
          className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden select-none z-0"
          style={{ opacity: 0.12 }}
        >
          <span
            className="text-8xl md:text-9xl font-bold font-['Noto_Serif_Bengali'] transform -rotate-25 tracking-widest uppercase select-none"
            style={{ color: palette.primary }}
          >
            {config.watermarkText}
          </span>
        </div>
      )}

      {/* Top Header - Centered */}
      <div
        className="relative z-10 flex flex-col items-center justify-center border-b pb-2 text-center"
        style={{ borderColor: palette.primaryBorder }}
      >
        <div className="flex items-center justify-center space-x-3">
          <BoardEmblem
            className="w-12 h-12 flex-shrink-0"
            type={emblemType}
            color={palette.primary}
          />
          <div className="flex flex-col items-center max-w-xl">
            <h1 className="font-bold text-lg md:text-xl font-['Noto_Serif_Bengali'] leading-normal mb-0.5 text-center" style={{ color: palette.primary }}>
              {config.boardName}
            </h1>
            <div className="flex items-center justify-center space-x-1.5 mt-0.5">
              <span className="font-bold text-sm tracking-tight font-['Noto_Serif_Bengali'] whitespace-nowrap leading-none" style={{ color: palette.primary }}>
                {config.examName} • বহুনির্বাচনী (MCQ) উত্তরপত্র {config.examYear ? `(${toBengaliNumber(config.examYear)})` : ''}
              </span>
            </div>
          </div>
        </div>

        {config.showBarcode && (
          <div className="absolute right-0 top-0 flex flex-col items-end">
            <span className="font-mono font-bold text-xs text-black">
              {currentSerial}
            </span>
            <div className="mt-0.5">
              <BarcodeRenderer value={currentSerial} width={1.1} height={18} displayValue={false} />
            </div>
          </div>
        )}
      </div>

      {/* Sensor Timing Bar */}
      <div className="relative z-10 mt-1">
        <OmrTimingBar
          color={palette.primary}
          borderColor={palette.primaryBorder}
          blockCount={22}
          showSubtitle={true}
        />
      </div>

      {/* Candidate Roll, Reg & Set Code Bar */}
      <div className="relative z-10 mt-2 flex items-start justify-between gap-1.5 border p-2 bg-slate-50/50" style={{ borderColor: palette.primaryBorder }}>
        {/* Set Code Box */}
        <div className="flex flex-col items-center border p-1 bg-white" style={{ borderColor: palette.primaryBorder, width: '75px' }}>
          <div className="font-bold text-[11px] text-center pb-1 border-b w-full" style={{ borderColor: palette.primaryBorder, color: palette.primary }}>
            সেট কোড
          </div>
          <div className="space-y-1 py-1">
            {['ক', 'খ', 'গ', 'ঘ'].map((set) => (
              <div key={set} className="flex items-center space-x-1.5 text-[10px] font-semibold">
                <div
                  className="w-3.5 h-3.5 rounded-full border flex items-center justify-center font-bold text-[9px]"
                  style={{ borderColor: palette.bubbleBorder, color: palette.primary }}
                >
                  {set}
                </div>
                <span>সেট</span>
              </div>
            ))}
          </div>
        </div>

        {/* Roll */}
        <OmrBubbleMatrix
          title="রোল নম্বর"
          columnsCount={config.rollLength}
          palette={palette}
          prefillValues={currentRoll}
          fillBubbles={config.prefillBubbles}
          bubbleSize={14}
          boxHeight={18}
        />

        {/* Registration */}
        <OmrBubbleMatrix
          title="রেজিস্ট্রেশন নম্বর"
          columnsCount={config.regLength}
          palette={palette}
          prefillValues={currentReg}
          fillBubbles={config.prefillBubbles}
          bubbleSize={14}
          boxHeight={18}
        />

        {/* Subject Code */}
        <OmrBubbleMatrix
          title="বিষয় কোড"
          columnsCount={config.subjectCodeLength}
          palette={palette}
          prefillValues={currentSubjectCode}
          fillBubbles={config.prefillBubbles}
          bubbleSize={14}
          boxHeight={18}
        />

        {/* Invigilator Signature */}
        <div className="flex flex-col items-center flex-shrink-0" style={{ width: '85px' }}>
          <div
            className="w-full border p-1 bg-white flex flex-col justify-between"
            style={{ borderColor: palette.primaryBorder, minHeight: '90px' }}
          >
            <div className="text-[9px] font-bold text-center leading-tight" style={{ color: palette.primary }}>
              {config.invigilatorTitle || 'কক্ষ পরিদর্শকের স্বাক্ষর'}
            </div>
            <div className="flex-1 flex items-center justify-center">
              <span className="text-[7.5px] text-slate-300 italic">স্বাক্ষর ও তারিখ</span>
            </div>
          </div>
          {config.showQrCode && (
            <div className="mt-1">
              <QrCodeRenderer value={`MCQ-${currentSerial}`} size={54} />
            </div>
          )}
        </div>
      </div>

      {/* MCQ Answer Bubbles Section */}
      <div className="relative z-10 mt-3 border p-2 bg-white" style={{ borderColor: palette.primaryBorder }}>
        <div
          className="text-center font-bold text-xs pb-1 mb-2 border-b flex justify-between items-center"
          style={{ borderColor: palette.primaryBorder, color: palette.primary }}
        >
          <span>বহুনির্বাচনী প্রশ্নোত্তরের অংশ (সঠিক উত্তরের বৃত্তটি বলপেন দিয়ে সম্পূর্ণ ভরাট করুন)</span>
          <span className="text-[10px] bg-slate-100 px-2 py-0.5 rounded">মোট প্রশ্ন: {toBengaliNumber(config.mcqCount)} টি</span>
        </div>

        <div className={`grid grid-cols-${colCount} gap-2`}>
          {Array.from({ length: colCount }).map((_, cIdx) => {
            const startQ = cIdx * questionsPerCol + 1;
            const endQ = Math.min((cIdx + 1) * questionsPerCol, config.mcqCount);

            return (
              <div key={cIdx} className="border-r last:border-r-0 pr-2">
                <div className="flex items-center justify-between font-bold text-[10px] pb-1 mb-1 border-b" style={{ borderColor: palette.primaryBorder }}>
                  <span className="w-6 text-center">নং</span>
                  <div className="flex-1 flex justify-around">
                    {optionLabels.map((lbl) => (
                      <span key={lbl} className="w-5 text-center">{lbl}</span>
                    ))}
                  </div>
                </div>

                <div className="space-y-1">
                  {Array.from({ length: endQ - startQ + 1 }).map((_, qIdx) => {
                    const qNumber = startQ + qIdx;
                    return (
                      <div key={qNumber} className="flex items-center justify-between py-0.5">
                        <span className="w-6 text-center font-mono font-bold text-[11px] text-slate-700">
                          {toBengaliNumber(qNumber)}
                        </span>
                        <div className="flex-1 flex justify-around">
                          {optionLabels.map((lbl) => (
                            <div
                              key={lbl}
                              className="w-4 h-4 rounded-full border flex items-center justify-center font-bold text-[9px] cursor-pointer"
                              style={{
                                borderColor: palette.bubbleBorder,
                                color: palette.primary,
                              }}
                            >
                              {lbl}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom Timing Track */}
      <div className="w-full flex items-center justify-between px-1 mt-4">
        {Array.from({ length: 42 }).map((_, idx) => (
          <div key={idx} className="w-2.5 h-1.5 bg-black" />
        ))}
      </div>

      {/* Bottom Corner Black Squares */}
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-black" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-black" />
    </div>
  );
};
