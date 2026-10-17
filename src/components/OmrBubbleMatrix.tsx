import React from 'react';
import { ColorPalette, toBengaliNumber } from '../utils/omrStyles';

interface OmrBubbleMatrixProps {
  title: string;
  columnsCount: number;
  palette: ColorPalette;
  prefillValues?: string; // e.g. "124501"
  fillBubbles?: boolean;
  boxHeight?: number;
  bubbleSize?: number;
  headerSubtext?: string;
  className?: string;
}

export const OmrBubbleMatrix: React.FC<OmrBubbleMatrixProps> = ({
  title,
  columnsCount,
  palette,
  prefillValues = '',
  fillBubbles = false,
  boxHeight = 22,
  bubbleSize = 16,
  headerSubtext,
  className = '',
}) => {
  const digits = prefillValues.padStart(columnsCount, ' ').slice(-columnsCount).split('');

  return (
    <div
      className={`inline-flex flex-col border border-collapse select-none ${className}`}
      style={{ borderColor: palette.primaryBorder }}
    >
      {/* Title Header */}
      <div
        className="px-1.5 py-0.5 text-center font-bold text-[11px] leading-tight border-b"
        style={{
          borderColor: palette.primaryBorder,
          color: palette.primary,
          backgroundColor: '#ffffff',
        }}
      >
        <span>{title}</span>
        {headerSubtext && (
          <span className="block text-[8px] font-normal opacity-80">{headerSubtext}</span>
        )}
      </div>

      {/* Digit Input Boxes Row */}
      <div className="flex border-b" style={{ borderColor: palette.primaryBorder }}>
        {Array.from({ length: columnsCount }).map((_, colIdx) => {
          const char = digits[colIdx] || '';
          return (
            <div
              key={colIdx}
              className="flex-1 flex items-center justify-center font-mono font-bold text-[13px] border-r last:border-r-0"
              style={{
                height: `${boxHeight}px`,
                borderColor: palette.primaryBorder,
                backgroundColor: '#ffffff',
                color: palette.primary,
              }}
            >
              {char !== ' ' ? toBengaliNumber(char) : ''}
            </div>
          );
        })}
      </div>

      {/* Bubble Matrix (Rows 0 to 9) */}
      <div className="flex flex-col py-0.5 px-0.5 bg-white">
        {Array.from({ length: 10 }).map((_, rowIdx) => {
          const rowDigitStr = rowIdx.toString();
          return (
            <div key={rowIdx} className="flex items-center justify-between my-[1px]">
              {Array.from({ length: columnsCount }).map((_, colIdx) => {
                const targetChar = digits[colIdx];
                const isSelected = fillBubbles && targetChar === rowDigitStr;

                return (
                  <div
                    key={colIdx}
                    className="flex-1 flex items-center justify-center px-[1px]"
                  >
                    <div
                      className="rounded-full flex items-center justify-center font-bold text-[9px] transition-all cursor-default"
                      style={{
                        width: `${bubbleSize}px`,
                        height: `${bubbleSize}px`,
                        borderColor: isSelected ? '#000000' : palette.bubbleBorder,
                        borderWidth: '1px',
                        borderStyle: 'solid',
                        backgroundColor: isSelected ? '#000000' : '#ffffff',
                        color: isSelected ? '#ffffff' : palette.primary,
                      }}
                      title={`Digit ${toBengaliNumber(rowIdx)}`}
                    >
                      {isSelected ? '' : toBengaliNumber(rowIdx)}
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};
