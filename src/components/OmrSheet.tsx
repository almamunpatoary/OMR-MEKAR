import React from 'react';
import { OmrConfig, BatchStudent } from '../types/omr';
import { getColorPalette, toBengaliNumber } from '../utils/omrStyles';
import { BoardEmblem } from './BoardEmblem';
import { OmrTimingBar } from './OmrTimingBar';
import { OmrBubbleMatrix } from './OmrBubbleMatrix';
import { BarcodeRenderer } from './BarcodeRenderer';
import { QrCodeRenderer } from './QrCodeRenderer';
import { QuestionMarksGrid } from './QuestionMarksGrid';
import { Scissors } from 'lucide-react';

interface OmrSheetProps {
  config: OmrConfig;
  student?: BatchStudent;
  pageIndex?: number;
}

export const OmrSheet: React.FC<OmrSheetProps> = ({
  config,
  student,
  pageIndex = 0,
}) => {
  const palette = getColorPalette(config.colorScheme);

  // Active serial, roll, reg numbers (custom or batch student)
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

  // Format year cleanly as natural text (no boxes)
  const formattedYear = config.examYear
    ? (config.examYear.length === 2 && !config.examYear.startsWith('২০')
        ? `২০${toBengaliNumber(config.examYear)}`
        : toBengaliNumber(config.examYear))
    : '';

  // QR Code payload
  const qrData = JSON.stringify({
    b: config.boardName,
    e: config.examName,
    s: currentSerial,
    r: currentRoll || 'BLANK',
    reg: currentReg || 'BLANK',
  });

  const emblemType = config.boardName.includes('মাদ্রাসা')
    ? 'madrasah'
    : config.boardName.includes('স্কুল') || config.boardName.includes('মডেল')
    ? 'school'
    : 'general';

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
      {/* Black Optical Timing Squares along the top corners */}
      <div className="absolute top-2 left-2 w-3.5 h-3.5 bg-black" />
      <div className="absolute top-2 right-2 w-3.5 h-3.5 bg-black" />

      {/* ========================================================================= */}
      {/* TOP PART: পরীক্ষার্থী অংশ (Candidate OMR Section)                          */}
      {/* ========================================================================= */}
      <div className="relative pb-2">
        {/* Soft Diagonal Watermark */}
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

        {/* Top Header Row - Centered Header */}
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
              <h1
                className="font-bold text-lg md:text-xl font-['Noto_Serif_Bengali'] text-center leading-normal mb-0.5"
                style={{ color: palette.primary }}
              >
                {config.boardName}
              </h1>
              <div className="flex items-center justify-center space-x-1.5 mt-0.5">
                <span className="font-bold text-sm tracking-tight font-['Noto_Serif_Bengali'] whitespace-nowrap leading-none" style={{ color: palette.primary }}>
                  {config.examName} {formattedYear ? `- ${formattedYear}` : ''}
                </span>
              </div>
            </div>
          </div>

          {/* Barcode only if explicitly enabled in settings, otherwise completely hidden */}
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

        {/* Top Timing Sensor Track */}
        <div className="relative z-10 mt-1">
          <OmrTimingBar
            color={palette.primary}
            borderColor={palette.primaryBorder}
            blockCount={22}
            showSubtitle={true}
          />
        </div>

        {/* Candidate Detail Bubble Grid */}
        <div className="relative z-10 mt-1.5 flex items-start justify-between gap-1.5">
          {/* Left Fiducial Black Square */}
          <div className="w-3 h-3 bg-black self-center flex-shrink-0" />

          {/* 1. Exam Type Selection Box + QR Code */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: '92px' }}>
            <div
              className="w-full border p-1 bg-white"
              style={{ borderColor: palette.primaryBorder }}
            >
              <div
                className="font-bold text-[11px] text-center pb-1 border-b mb-1 whitespace-nowrap"
                style={{ borderColor: palette.primaryBorder, color: palette.primary }}
              >
                পরীক্ষা
              </div>
              <div className="space-y-1.5 py-0.5 px-0.5">
                {config.examTypeOptions.map((opt, idx) => {
                  const isChecked = config.selectedExamType === opt;
                  return (
                    <div key={idx} className="flex items-center space-x-1 text-[9.5px] font-semibold whitespace-nowrap">
                      <div
                        className="w-3.5 h-3.5 rounded-full border flex items-center justify-center flex-shrink-0"
                        style={{
                          borderColor: palette.bubbleBorder,
                          backgroundColor: isChecked && config.prefillBubbles ? '#000000' : '#ffffff',
                        }}
                      >
                        {isChecked && config.prefillBubbles && (
                          <div className="w-2 h-2 rounded-full bg-black" />
                        )}
                      </div>
                      <span className="whitespace-nowrap" style={{ color: palette.primary }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QR Code below exam box */}
            {config.showQrCode && (
              <div className="mt-2.5 p-1 border border-slate-200 bg-white shadow-xs flex flex-col items-center">
                <QrCodeRenderer value={qrData} size={70} />
                <span className="text-[7px] text-slate-500 font-mono mt-0.5">OMR VERIFIED</span>
              </div>
            )}
          </div>

          {/* 2. Roll Number Matrix (6 digits) */}
          <OmrBubbleMatrix
            title="রোল নম্বর"
            columnsCount={config.rollLength}
            palette={palette}
            prefillValues={currentRoll}
            fillBubbles={config.prefillBubbles}
            bubbleSize={15}
            boxHeight={20}
          />

          {/* 3. Registration Number Matrix (10 digits) */}
          <OmrBubbleMatrix
            title="রেজিস্ট্রেশন নম্বর"
            columnsCount={config.regLength}
            palette={palette}
            prefillValues={currentReg}
            fillBubbles={config.prefillBubbles}
            bubbleSize={15}
            boxHeight={20}
          />

          {/* 4. Subject Code Matrix (3 digits) */}
          <OmrBubbleMatrix
            title="বিষয় কোড"
            columnsCount={config.subjectCodeLength}
            palette={palette}
            prefillValues={currentSubjectCode}
            fillBubbles={config.prefillBubbles}
            bubbleSize={15}
            boxHeight={20}
          />

          {/* 5. Extra Script Count Matrix (2 digits) */}
          <OmrBubbleMatrix
            title="অতিরিক্ত উত্তর সংখ্যা"
            columnsCount={config.extraSheetLength}
            palette={palette}
            prefillValues=""
            fillBubbles={false}
            bubbleSize={15}
            boxHeight={20}
          />

          {/* 6. Invigilator Signature & Date (Right section) */}
          <div className="flex flex-col items-center flex-shrink-0" style={{ width: '92px' }}>
            <div
              className="text-[8px] font-semibold text-center mb-1 leading-tight"
              style={{ color: palette.primary }}
            >
              (বি: দ্র: কোন প্রকার সীলমোহর দেয়া নিষেধ)
            </div>

            {/* Date Box */}
            <div
              className="w-full border p-1 bg-white mb-1.5"
              style={{ borderColor: palette.primaryBorder }}
            >
              <div className="text-[9px] font-bold text-center" style={{ color: palette.primary }}>
                তারিখ
              </div>
              <div className="h-6 flex items-end justify-center pb-0.5">
                <span className="text-[8px] text-slate-400">.../.../২০২...</span>
              </div>
            </div>

            {/* Signature Box */}
            <div
              className="w-full border p-1 bg-white flex flex-col justify-between"
              style={{ borderColor: palette.primaryBorder, minHeight: '95px' }}
            >
              <div className="text-[9px] font-bold text-center leading-tight" style={{ color: palette.primary }}>
                {config.invigilatorTitle || 'কক্ষ পরিদর্শকের স্বাক্ষর'}
              </div>
              <div className="flex-1 flex items-center justify-center">
                <span className="text-[7.5px] text-slate-300 italic">স্বাক্ষর</span>
              </div>
              <div className="text-[7.5px] text-center opacity-75 border-t pt-0.5" style={{ borderColor: palette.primaryBorder }}>
                বক্সের বাইরে স্বাক্ষর দেয়া নিষেধ
              </div>
            </div>

            {/* Form Code */}
            <div className="text-[7px] text-slate-400 font-mono mt-1">
              BMEB-FORM-2026
            </div>
          </div>

          {/* Right Fiducial Black Square */}
          <div className="w-3 h-3 bg-black self-center flex-shrink-0" />
        </div>

        {/* Optical Timing Track Bar at Candidate Section Bottom */}
        <div className="w-full flex items-center justify-between px-1 mt-2">
          {Array.from({ length: 42 }).map((_, idx) => (
            <div key={idx} className="w-2.5 h-1.5 bg-black" />
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PERFORATION CUTTING LINE (ছিঁড়ে ফেলার ডট লাইন)                             */}
      {/* ========================================================================= */}
      {config.showPerforation && (
        <div className="relative py-2 my-1 border-t-2 border-b-2 border-dashed border-black/40 flex items-center justify-between">
          <div className="w-3.5 h-3.5 bg-black flex-shrink-0" />
          <div className="flex items-center space-x-2 text-[10px] font-bold text-slate-600 bg-white px-2 whitespace-nowrap">
            <Scissors className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="whitespace-nowrap">ছিঁড়ে ফেলার দাগ (পারফোরেশন লাইন)</span>
            <span className="text-slate-400">|</span>
            <span className="font-semibold whitespace-nowrap">পরীক্ষক / প্রধান পরীক্ষকের অংশ</span>
          </div>
          <div className="w-3.5 h-3.5 bg-black flex-shrink-0" />
        </div>
      )}

      {/* ========================================================================= */}
      {/* BOTTOM PART: পরীক্ষক / প্রধান পরীক্ষকের অংশ                                 */}
      {/* ========================================================================= */}
      {config.showBottomSection && (
        <div className="relative pt-1">
          {/* 1. Question Marks Grid from image ee.JPG (প্রশ্ন ১-২০ মূল্যায়ন তালিকা) */}
          {(config.bottomSectionType === 'question_grid' || config.bottomSectionType === 'both') && (
            <QuestionMarksGrid
              boardName={config.boardName}
              palette={palette}
              emblemType={emblemType}
              numeralType={config.questionNumeralType || 'english'}
              questionCount={config.questionCount || 20}
            />
          )}

          {/* 2. Bubble Grid Examiner Section (if bubble_grid or both) */}
          {(config.bottomSectionType === 'bubble_grid' || config.bottomSectionType === 'both') && (
            <div className={`relative ${config.bottomSectionType === 'both' ? 'mt-4 pt-2 border-t-2 border-dashed border-slate-300' : ''}`}>
              {/* Header */}
              <div className="flex items-center justify-between border-b pb-1" style={{ borderColor: palette.primaryBorder }}>
                <div className="flex items-center space-x-2">
                  <BoardEmblem
                    className="w-8 h-8 flex-shrink-0"
                    type={emblemType}
                    color={palette.primary}
                  />
                  <div>
                    <h2
                      className="font-bold text-sm leading-tight font-['Noto_Serif_Bengali']"
                      style={{ color: palette.primary }}
                    >
                      {config.boardName}
                    </h2>
                    <div className="flex items-center space-x-1.5 text-xs">
                      <span className="font-semibold" style={{ color: palette.primary }}>
                        {config.examName} {formattedYear ? `- ${formattedYear}` : ''}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-[10px] font-bold px-2 py-0.5 border" style={{ borderColor: palette.primaryBorder, color: palette.primary }}>
                  পরীক্ষক / প্রধান পরীক্ষকের অংশ
                </div>
              </div>

              {/* Timing Bar for Examiner Section */}
              <div className="mt-1">
                <OmrTimingBar
                  color={palette.primary}
                  borderColor={palette.primaryBorder}
                  blockCount={22}
                  showSubtitle={true}
                />
              </div>

          {/* Examiner Detail Bubble Grid */}
          <div className="mt-1.5 flex items-start justify-between gap-1.5">
            {/* Left Fiducial Black Square */}
            <div className="w-3 h-3 bg-black self-center flex-shrink-0" />

            {/* 1. Subject Code Matrix (3 digits) */}
            <OmrBubbleMatrix
              title="বিষয় কোড"
              columnsCount={3}
              palette={palette}
              prefillValues={currentSubjectCode}
              fillBubbles={config.prefillBubbles}
              bubbleSize={15}
              boxHeight={20}
            />

            {/* 2. Examiner Code Matrix (4 digits) */}
            <OmrBubbleMatrix
              title="পরীক্ষক কোড"
              columnsCount={4}
              palette={palette}
              prefillValues=""
              fillBubbles={false}
              bubbleSize={15}
              boxHeight={20}
            />

            {/* 3. Script Serial Number Matrix (6 digits) */}
            <OmrBubbleMatrix
              title="খাতার ক্রমিক নম্বর"
              columnsCount={6}
              palette={palette}
              prefillValues=""
              fillBubbles={false}
              bubbleSize={15}
              boxHeight={20}
            />

            {/* 4. Examiner QR Code */}
            {config.showQrCode && (
              <div className="p-1 border border-slate-200 bg-white flex flex-col items-center self-center">
                <QrCodeRenderer value={`EXAMINER-${currentSerial}`} size={64} />
                <span className="text-[7px] text-slate-500 font-mono mt-0.5">EXAMINER-QR</span>
              </div>
            )}

            {/* 5. Marks Obtained Matrix (3 digits) */}
            <div className="relative">
              <OmrBubbleMatrix
                title="প্রাপ্ত নম্বর"
                columnsCount={3}
                palette={palette}
                prefillValues=""
                fillBubbles={false}
                bubbleSize={15}
                boxHeight={20}
              />
              <div
                className="text-[7.5px] font-semibold text-center mt-0.5"
                style={{ color: palette.primary }}
              >
                পরীক্ষার্থীর প্রাপ্ত মোট নম্বর
              </div>
            </div>

            {/* 6. Head Examiner Marks Matrix (3 digits) */}
            <OmrBubbleMatrix
              title="প্র: পরীক্ষকের নম্বর"
              headerSubtext="(প্রযোজ্য হলে)"
              columnsCount={3}
              palette={palette}
              prefillValues=""
              fillBubbles={false}
              bubbleSize={15}
              boxHeight={20}
            />

            {/* 7. Examiner & Head Examiner Signatures (Right Section) */}
            <div className="flex flex-col items-center flex-shrink-0" style={{ width: '95px' }}>
              {/* Box 1: Examiner Signature */}
              <div
                className="w-full border p-1 bg-white mb-1"
                style={{ borderColor: palette.primaryBorder, minHeight: '44px' }}
              >
                <div className="text-[8px] font-bold text-center leading-tight" style={{ color: palette.primary }}>
                  পরীক্ষকের স্বাক্ষর
                </div>
              </div>

              {/* Box 2: Scrutinizer Signature */}
              <div
                className="w-full border p-1 bg-white mb-1"
                style={{ borderColor: palette.primaryBorder, minHeight: '44px' }}
              >
                <div className="text-[8px] font-bold text-center leading-tight" style={{ color: palette.primary }}>
                  নিরীক্ষকের স্বাক্ষর
                </div>
              </div>

              {/* Box 3: Head Examiner Signature */}
              <div
                className="w-full border p-1 bg-white"
                style={{ borderColor: palette.primaryBorder, minHeight: '44px' }}
              >
                <div className="text-[8px] font-bold text-center leading-tight" style={{ color: palette.primary }}>
                  প্রধান পরীক্ষকের স্বাক্ষর
                </div>
                <div className="text-[7px] text-center opacity-70">কোড: ..........</div>
              </div>

              <div className="text-[7px] text-center opacity-75 mt-0.5 leading-tight">
                বক্সের বাইরে স্বাক্ষর দেয়া নিষেধ
              </div>
            </div>

            {/* Right Fiducial Black Square */}
            <div className="w-3 h-3 bg-black self-center flex-shrink-0" />
          </div>

          {/* Bottom Edge Optical Timing Marks */}
          <div className="w-full flex items-center justify-between px-1 mt-3">
            {Array.from({ length: 42 }).map((_, idx) => (
              <div key={idx} className="w-2.5 h-1.5 bg-black" />
            ))}
          </div>

          {/* Form revision stamp */}
          <div className="flex justify-between items-center text-[7.5px] text-slate-400 font-mono mt-1">
            <span>PRINT CODE: MEB-OMR-2026-REV4</span>
            <span>পৃষ্ঠা: ১/১</span>
          </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom Corner Black Squares */}
      <div className="absolute bottom-2 left-2 w-3.5 h-3.5 bg-black" />
      <div className="absolute bottom-2 right-2 w-3.5 h-3.5 bg-black" />
    </div>
  );
};
