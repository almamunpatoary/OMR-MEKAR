import React from 'react';

interface OmrTimingBarProps {
  color?: string;
  borderColor?: string;
  blockCount?: number;
  showSubtitle?: boolean;
}

export const OmrTimingBar: React.FC<OmrTimingBarProps> = ({
  color = '#881337',
  borderColor = '#9f1239',
  blockCount = 20,
  showSubtitle = true,
}) => {
  return (
    <div className="w-full flex flex-col items-center select-none my-1">
      {/* Sensor Timing Track Box */}
      <div
        className="w-full border px-2 py-1 flex flex-col items-center justify-center relative bg-white"
        style={{ borderColor: borderColor }}
      >
        <span
          className="text-[11px] font-bold tracking-wide mb-1 whitespace-nowrap leading-none text-center"
          style={{ color: color }}
        >
          এ বক্সের মধ্যে কোন দাগ দেয়া নিষেধ
        </span>

        {/* Optical Sensor Timing Blocks with periodic circular reference holes */}
        <div className="w-full flex items-center justify-between px-1">
          {Array.from({ length: blockCount }).map((_, index) => {
            const isCircle = index === 4 || index === 9 || index === 14 || index === 19;
            if (isCircle) {
              return (
                <div
                  key={index}
                  className="w-3.5 h-3.5 rounded-full border border-black bg-white flex items-center justify-center flex-shrink-0"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-slate-300" />
                </div>
              );
            }
            return (
              <div
                key={index}
                className="w-3.5 h-3.5 bg-black flex-shrink-0"
                style={{ minWidth: '10px' }}
              />
            );
          })}
        </div>
      </div>

      {showSubtitle && (
        <p
          className="text-[11px] font-bold mt-1 tracking-tight text-center whitespace-nowrap leading-none"
          style={{ color: color }}
        >
          অবশ্যই কালো কালির বল পয়েন্ট কলম দিয়ে বৃত্ত ভরাট করতে হবে।
        </p>
      )}
    </div>
  );
};
