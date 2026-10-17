import React from 'react';
import { ColorPalette, toBengaliNumber } from '../utils/omrStyles';
import { BoardEmblem } from './BoardEmblem';
import { OmrTimingBar } from './OmrTimingBar';

interface QuestionMarksGridProps {
  boardName: string;
  palette: ColorPalette;
  emblemType?: 'madrasah' | 'general' | 'school';
  numeralType?: 'english' | 'bengali';
  questionCount?: number; // default 20
}

export const QuestionMarksGrid: React.FC<QuestionMarksGridProps> = ({
  boardName,
  palette,
  emblemType = 'general',
  numeralType = 'english',
  questionCount = 20,
}) => {
  return (
    <div
      className="w-full border-t-2 border-dashed border-slate-400/80 pt-2 mt-2 relative select-none"
      style={{ borderColor: palette.primaryBorder }}
    >
      {/* Black Optical Timing Squares at Left and Right */}
      <div className="absolute top-3 left-0 w-3 h-3 bg-black" />
      <div className="absolute top-3 right-0 w-3 h-3 bg-black" />

      {/* Top Title Row: "উত্তরপত্রের অংশ" on left, Emblem + Board Name in Center */}
      <div className="flex items-center justify-between px-5 mb-1.5">
        <div
          className="text-xs font-bold font-['Noto_Serif_Bengali'] whitespace-nowrap flex-shrink-0"
          style={{ color: palette.primary }}
        >
          উত্তরপত্রের অংশ
        </div>

        <div className="flex items-center justify-center space-x-2 flex-1 mx-2">
          <BoardEmblem
            className="w-6 h-6 flex-shrink-0"
            type={emblemType}
            color={palette.primary}
          />
          <h2
            className="font-bold text-sm tracking-tight font-['Noto_Serif_Bengali'] text-center truncate"
            style={{ color: palette.primary }}
          >
            {boardName}
          </h2>
        </div>

        <div className="w-16 flex-shrink-0" /> {/* spacer to balance */}
      </div>

      {/* Timing Bar: "এ বক্সের মধ্যে কোন দাগ দেয়া যাবে না" */}
      <div className="px-5">
        <div
          className="w-full border px-2 py-0.5 flex flex-col items-center justify-center relative"
          style={{
            borderColor: palette.primaryBorder,
            backgroundColor: palette.primaryLight,
          }}
        >
          <span
            className="text-[10px] font-bold tracking-wide mb-0.5 whitespace-nowrap leading-none text-center"
            style={{ color: palette.primary }}
          >
            এ বক্সের মধ্যে কোন দাগ দেয়া যাবে না
          </span>

          <div className="w-full flex items-center justify-between px-1">
            {Array.from({ length: 24 }).map((_, index) => {
              const isCircle = index % 5 === 2 || index % 5 === 4;
              if (isCircle) {
                return (
                  <div
                    key={index}
                    className="w-3 h-3 rounded-full border border-black bg-white flex items-center justify-center"
                  >
                    <div className="w-1 h-1 rounded-full bg-slate-300" />
                  </div>
                );
              }
              return (
                <div
                  key={index}
                  className="w-3 h-3 bg-black"
                  style={{ minWidth: '9px' }}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Second Row: বিষয় কোড, পরীক্ষক কোড, উত্তরপত্রের মাঝের অংশে ব্যবহৃত ক্রমিক নম্বর, প্রাপ্ত মোট নম্বর */}
      <div className="px-5 mt-2 flex items-end justify-between gap-2">
        {/* বিষয় কোড */}
        <div className="flex flex-col items-center">
          <div className="flex border" style={{ borderColor: palette.primaryBorder }}>
            {Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 border-r last:border-r-0 bg-white"
                style={{ borderColor: palette.primaryBorder }}
              />
            ))}
          </div>
          <span
            className="text-[9px] font-bold mt-0.5"
            style={{ color: palette.primary }}
          >
            বিষয় কোড
          </span>
        </div>

        {/* পরীক্ষক কোড */}
        <div className="flex flex-col items-center">
          <div className="flex border" style={{ borderColor: palette.primaryBorder }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 border-r last:border-r-0 bg-white"
                style={{ borderColor: palette.primaryBorder }}
              />
            ))}
          </div>
          <span
            className="text-[9px] font-bold mt-0.5"
            style={{ color: palette.primary }}
          >
            পরীক্ষক কোড
          </span>
        </div>

        {/* উত্তরপত্রের মাঝের অংশে ব্যবহৃত ক্রমিক নম্বর */}
        <div className="flex items-center space-x-2">
          <div
            className="text-[9px] font-bold text-right leading-tight max-w-[140px]"
            style={{ color: palette.primary }}
          >
            উত্তরপত্রের মাঝের অংশে ব্যবহৃত ক্রমিক নম্বর
          </div>
          <div className="flex border" style={{ borderColor: palette.primaryBorder }}>
            {Array.from({ length: 4 }).map((_, i) => (
              <div
                key={i}
                className="w-6 h-6 border-r last:border-r-0 bg-white"
                style={{ borderColor: palette.primaryBorder }}
              />
            ))}
          </div>
        </div>

        {/* প্রাপ্ত মোট নম্বর */}
        <div className="flex items-center space-x-1">
          <div
            className="border flex flex-col items-center justify-between"
            style={{ borderColor: palette.primaryBorder, width: '64px', height: '52px' }}
          >
            <div className="flex-1 bg-white w-full" />
            <div
              className="w-full text-center text-[9px] font-bold border-t py-0.5 bg-slate-50 leading-tight"
              style={{ borderColor: palette.primaryBorder, color: palette.primary }}
            >
              প্রাপ্ত মোট নম্বর
            </div>
          </div>

          <div
            className="text-[7.5px] font-bold leading-tight max-w-[85px] border-l pl-1"
            style={{ borderColor: palette.primaryBorder, color: palette.primary }}
          >
            প্রাপ্ত মোট নম্বর মাঝের অংশের প্রাপ্ত নম্বরের ঘরে তুলে বৃত্ত ভরাট করতে হবে
          </div>
        </div>
      </div>

      {/* Third Section: Question-wise Marks Entry Grid (1 to 20) */}
      <div className="px-5 mt-2">
        <div
          className="w-full border border-collapse"
          style={{ borderColor: palette.primaryBorder }}
        >
          {/* Row 1: Marks entry cells (নম্বর) */}
          <div className="flex border-b" style={{ borderColor: palette.primaryBorder }}>
            {/* Row 1 label: "নম্বর" */}
            <div
              className="w-10 border-r flex items-center justify-center font-bold text-[10px] bg-slate-50/70"
              style={{
                borderColor: palette.primaryBorder,
                color: palette.primary,
                minHeight: '44px',
              }}
            >
              <span
                style={{ writingMode: 'vertical-rl', transform: 'rotate(180deg)' }}
                className="font-bold text-[10px] tracking-wider"
              >
                নম্বর
              </span>
            </div>

            {/* 20 Blank boxes for question marks */}
            {Array.from({ length: questionCount }).map((_, idx) => (
              <div
                key={idx}
                className="flex-1 border-r last:border-r-0 bg-white min-h-[38px]"
                style={{ borderColor: palette.primaryBorder }}
              />
            ))}

            {/* Total marks box */}
            <div
              className="w-14 border-l bg-white flex items-center justify-center"
              style={{ borderColor: palette.primaryBorder }}
            />
          </div>

          {/* Row 2: Question Numbers (প্রশ্ন নম্বর: 1 to 20) */}
          <div className="flex bg-slate-50/40">
            {/* Row 2 label: "প্রশ্ন নম্বর" */}
            <div
              className="w-10 border-r flex items-center justify-center font-bold text-[8.5px] bg-slate-50/90 py-1"
              style={{
                borderColor: palette.primaryBorder,
                color: palette.primary,
              }}
            >
              <span className="leading-tight text-center">
                প্রশ্ন<br />নম্বর
              </span>
            </div>

            {/* 1 to 20 columns */}
            {Array.from({ length: questionCount }).map((_, idx) => {
              const qNum = idx + 1;
              const displayNum =
                numeralType === 'bengali'
                  ? toBengaliNumber(qNum)
                  : qNum.toString();

              return (
                <div
                  key={idx}
                  className="flex-1 border-r last:border-r-0 py-1 flex items-center justify-center font-bold text-[11px] font-mono"
                  style={{
                    borderColor: palette.primaryBorder,
                    color: palette.primary,
                  }}
                >
                  {displayNum}
                </div>
              );
            })}

            {/* Right label: "প্রাপ্ত মোট নম্বর" */}
            <div
              className="w-14 border-l py-0.5 px-0.5 flex items-center justify-center text-center font-bold text-[8px] leading-tight bg-slate-50"
              style={{
                borderColor: palette.primaryBorder,
                color: palette.primary,
              }}
            >
              প্রাপ্ত<br />মোট নম্বর
            </div>
          </div>
        </div>
      </div>

      {/* Optical Timing Track at Bottom */}
      <div className="w-full flex items-center justify-between px-6 mt-2">
        {Array.from({ length: 42 }).map((_, idx) => (
          <div key={idx} className="w-2.5 h-1 bg-black" />
        ))}
      </div>
    </div>
  );
};
