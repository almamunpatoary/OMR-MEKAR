/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import {
  DEFAULT_MADRASAH_CONFIG,
  OmrConfig,
  PRESETS,
  BatchStudent,
} from './types/omr';
import { OmrSheet } from './components/OmrSheet';
import { McqOmrSheet } from './components/McqOmrSheet';
import { ControlPanel } from './components/ControlPanel';
import { BatchModal } from './components/BatchModal';
import { PrintDownloadModal } from './components/PrintDownloadModal';
import { downloadAsPdf, downloadAsImage, safePrint } from './utils/pdfExport';
import {
  Printer,
  FileDown,
  ZoomIn,
  ZoomOut,
  Sparkles,
  Users,
  SlidersHorizontal,
  ChevronLeft,
  ChevronRight,
  Eye,
  FileCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<OmrConfig>(DEFAULT_MADRASAH_CONFIG);
  const [zoomLevel, setZoomLevel] = useState<number>(0.92);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState<boolean>(false);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState<boolean>(false);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [exportStatusText, setExportStatusText] = useState<string>('');
  const [batchStudents, setBatchStudents] = useState<BatchStudent[]>([]);
  const [currentPage, setCurrentPage] = useState<number>(0);
  const [isMobilePanelOpen, setIsMobilePanelOpen] = useState<boolean>(false);
  const [viewAllBatchPages, setViewAllBatchPages] = useState<boolean>(false);

  const sheetCaptureRef = useRef<HTMLDivElement>(null);

  // Auto trigger native print if opened with ?print=true (outside iframe sandbox)
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('print') === 'true') {
      const timer = setTimeout(() => {
        try {
          window.print();
        } catch (e) {
          console.warn('Auto print failed:', e);
        }
      }, 700);
      return () => clearTimeout(timer);
    }
  }, []);

  const directPrintUrl = `${window.location.origin}${window.location.pathname}?print=true`;

  // 1-Click PDF Download handler
  const handleDownloadPdf = async () => {
    const targetEl = sheetCaptureRef.current || document.getElementById('omr-active-sheet');
    if (!targetEl) {
      console.warn('Sheet element not found for capture');
      return;
    }

    const safeExam = config.examName.replace(/[\/\s]/g, '_');
    const safeYear = (config.examYear || '2026').replace(/[\/\s]/g, '_');
    const fileName = `OMR_Sheet_${safeExam}_${safeYear}.pdf`;

    setIsExporting(true);
    setExportStatusText('পিডিএফ ফাইল প্রস্তুত হচ্ছে...');

    const originalZoom = zoomLevel;
    try {
      if (originalZoom !== 1) {
        setZoomLevel(1);
        await new Promise((r) => setTimeout(r, 80));
      }

      await downloadAsPdf(targetEl, fileName, ({ isExporting: exp, statusText }) => {
        setIsExporting(exp);
        setExportStatusText(statusText);
      });
    } finally {
      if (originalZoom !== 1) {
        setZoomLevel(originalZoom);
      }
      setIsExporting(false);
    }
  };

  // Image download handler
  const handleDownloadImage = async () => {
    const targetEl = sheetCaptureRef.current || document.getElementById('omr-active-sheet');
    if (!targetEl) return;

    const safeExam = config.examName.replace(/[\/\s]/g, '_');
    const safeYear = (config.examYear || '2026').replace(/[\/\s]/g, '_');
    const fileName = `OMR_Sheet_${safeExam}_${safeYear}.png`;

    setIsExporting(true);
    setExportStatusText('হাই-রেজোলিউশন ছবি তৈরি হচ্ছে...');

    const originalZoom = zoomLevel;
    try {
      if (originalZoom !== 1) {
        setZoomLevel(1);
        await new Promise((r) => setTimeout(r, 80));
      }

      await downloadAsImage(targetEl, fileName, ({ isExporting: exp, statusText }) => {
        setIsExporting(exp);
        setExportStatusText(statusText);
      });
    } finally {
      if (originalZoom !== 1) {
        setZoomLevel(originalZoom);
      }
      setIsExporting(false);
    }
  };

  const [printFeedback, setPrintFeedback] = useState<string | null>(null);

  // In-page direct print handler
  const handleTriggerPrint = async () => {
    const originalZoom = zoomLevel;
    if (originalZoom !== 1) {
      setZoomLevel(1);
      await new Promise((r) => setTimeout(r, 60));
    }

    try {
      window.print();
    } catch (e) {
      console.warn('Direct window.print() failed:', e);
      setPrintFeedback('ব্রাউজারের সুরক্ষার কারণে সরাসরি প্রিন্ট উইন্ডো ওপেন হয়নি। আপনার জন্য ক্রিস্টাল ক্লিয়ার A4 PDF ফাইল ডাউনলোড হচ্ছে...');
      setTimeout(() => {
        handleDownloadPdf();
      }, 300);
      setTimeout(() => {
        setPrintFeedback(null);
      }, 6000);
    } finally {
      if (originalZoom !== 1) {
        setZoomLevel(originalZoom);
      }
    }
  };

  const handleApplyBatch = (students: BatchStudent[]) => {
    setBatchStudents(students);
    setConfig((prev) => ({
      ...prev,
      isBatchMode: true,
      batchCount: students.length,
    }));
    setCurrentPage(0);
  };

  const applyPresetById = (presetId: string) => {
    const found = PRESETS.find((p) => p.id === presetId);
    if (found) {
      setConfig((prev) => ({
        ...prev,
        ...found.config,
      }));
    }
  };

  const totalPages = config.isBatchMode ? (batchStudents.length || config.batchCount) : 1;

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-['Hind_Siliguri',sans-serif]">
      {/* ========================================================================= */}
      {/* TOP NAVIGATION & 1-CLICK QUICK ACCESS BAR (No-print)                      */}
      {/* ========================================================================= */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs no-print">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex items-center justify-between gap-2">
          {/* Logo & Presets */}
          <div className="flex items-center space-x-3 overflow-x-auto py-1">
            <div className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                বিডি
              </div>
              <div className="hidden sm:block">
                <div className="font-bold text-xs text-slate-900 leading-tight">ওএমআর শিট মেকার</div>
                <div className="text-[10px] text-slate-500">বোর্ড স্ট্যান্ডার্ড ফরম্যাট</div>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block flex-shrink-0" />

            {/* Quick 1-Click Preset Buttons */}
            <div className="flex items-center space-x-1.5 flex-nowrap">
              <button
                onClick={() => applyPresetById('madrasah')}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center space-x-1 transition-all whitespace-nowrap cursor-pointer ${
                  config.boardName.includes('মাদ্রাসা')
                    ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="মাদ্রাসা শিক্ষা বোর্ড দাখিল ও আলিম ওএমআর শিট"
              >
                <span>🕌</span>
                <span>মাদ্রাসা বোর্ড</span>
              </button>

              <button
                onClick={() => applyPresetById('general_board')}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center space-x-1 transition-all whitespace-nowrap cursor-pointer ${
                  config.boardName.includes('উচ্চ মাধ্যমিক') && config.sheetMode === 'board_cover'
                    ? 'bg-rose-50 border-rose-300 text-rose-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="ঢাকা/সাধারণ শিক্ষা বোর্ড এসএসসি ও এইচএসসি ওএমআর"
              >
                <span>🏛️</span>
                <span>সাধারণ বোর্ড (এসএসসি/এইচএসসি)</span>
              </button>

              <button
                onClick={() => applyPresetById('school_model_test')}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center space-x-1 transition-all whitespace-nowrap cursor-pointer ${
                  config.boardName.includes('আইডিয়াল')
                    ? 'bg-slate-200 border-slate-400 text-slate-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="স্কুল বা মাদ্রাসার নিজস্ব মডেল টেস্ট ও বার্ষিক পরীক্ষা"
              >
                <span>🏫</span>
                <span>মডেল টেস্ট</span>
              </button>

              <button
                onClick={() => applyPresetById('mcq_30')}
                className={`text-xs px-2.5 py-1.5 rounded-lg border font-semibold flex items-center space-x-1 transition-all whitespace-nowrap cursor-pointer ${
                  config.sheetMode === 'mcq_only'
                    ? 'bg-blue-50 border-blue-300 text-blue-900 shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border-slate-200'
                }`}
                title="৩০ নম্বরের বহুনির্বাচনী এমসিকিউ উত্তরপত্র"
              >
                <span>📝</span>
                <span>এমসিকিউ শিট</span>
              </button>
            </div>
          </div>

          {/* Right Toolbar: Zoom + 1-Click Action Buttons */}
          <div className="flex items-center space-x-2 flex-shrink-0">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
              <button
                onClick={() => setZoomLevel((z) => Math.max(0.5, z - 0.1))}
                className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Zoom Out"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono font-medium px-1.5 text-slate-600">
                {Math.round(zoomLevel * 100)}%
              </span>
              <button
                onClick={() => setZoomLevel((z) => Math.min(1.5, z + 0.1))}
                className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-slate-900 cursor-pointer"
                title="Zoom In"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Mobile panel toggle */}
            <button
              onClick={() => setIsMobilePanelOpen(!isMobilePanelOpen)}
              className="md:hidden p-2 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 cursor-pointer"
              title="সেটিংস প্যানেল"
            >
              <SlidersHorizontal className="w-4 h-4" />
            </button>

            {/* Batch generator quick button */}
            <button
              onClick={() => setIsBatchModalOpen(true)}
              className="hidden sm:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 text-xs font-bold transition-all cursor-pointer"
            >
              <Users className="w-3.5 h-3.5 text-amber-700" />
              <span>ব্যাচ রোল</span>
            </button>

            {/* 1-Click Print & PDF Save Main Action (Opens options modal) */}
            <button
              onClick={() => setIsPrintModalOpen(true)}
              className="py-1.5 px-3.5 bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              title="১ ক্লিকে প্রিন্ট ও সংরক্ষণ অপশন ওপেন করুন"
            >
              <Printer className="w-4 h-4" />
              <span>১ ক্লিকে প্রিন্ট / PDF সংরক্ষণ</span>
            </button>

            {/* Direct Print Button */}
            <button
              onClick={handleTriggerPrint}
              className="hidden lg:flex py-1.5 px-2.5 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-xs rounded-lg shadow-xs items-center space-x-1 transition-all cursor-pointer"
              title="সরাসরি প্রিন্ট ডায়ালগ"
            >
              <Printer className="w-3.5 h-3.5 text-emerald-600" />
              <span>সরাসরি প্রিন্ট</span>
            </button>

            {/* 1-Click PDF Download Button */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExporting}
              className="py-1.5 px-3 bg-slate-800 hover:bg-slate-900 active:scale-95 text-white font-bold text-xs rounded-lg shadow-sm flex items-center space-x-1.5 transition-all cursor-pointer"
              title="পিডিএফ ফাইল ডাউনলোড করুন"
            >
              {isExporting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-400" />
                  <span>তৈরি হচ্ছে...</span>
                </>
              ) : (
                <>
                  <FileDown className="w-3.5 h-3.5 text-amber-400" />
                  <span>PDF ডাউনলোড</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Print Feedback Notification Bar if needed */}
        {printFeedback && (
          <div className="bg-amber-500 text-white px-4 py-2 text-xs font-medium text-center shadow-inner animate-in fade-in duration-200">
            {printFeedback}
          </div>
        )}
      </header>

      {/* ========================================================================= */}
      {/* MAIN CONTENT AREA: SIDEBAR (CONTROLS) + WORKSPACE CANVAS (PREVIEW)         */}
      {/* ========================================================================= */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar Control Panel (Desktop & Mobile Drawer) */}
        <aside
          className={`w-80 md:w-88 flex-shrink-0 z-20 transition-all duration-200 bg-white ${
            isMobilePanelOpen
              ? 'fixed inset-y-0 left-0 shadow-2xl pt-14 md:pt-0'
              : 'hidden md:flex'
          }`}
        >
          <ControlPanel
            config={config}
            onChange={setConfig}
            onPrint={() => setIsPrintModalOpen(true)}
            onDownloadPdf={handleDownloadPdf}
            onOpenExportModal={() => setIsPrintModalOpen(true)}
            onOpenBatchModal={() => setIsBatchModalOpen(true)}
            batchCount={totalPages}
            isExporting={isExporting}
            statusText={exportStatusText}
          />
        </aside>

        {/* Center Workspace & OMR Canvas */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-200/90 p-4 sm:p-6 lg:p-8">
          {/* Top Info Bar inside preview */}
          <div className="max-w-4xl mx-auto w-full mb-3 flex items-center justify-between no-print">
            <div className="flex items-center space-x-2">
              <span className="inline-flex items-center space-x-1 text-xs font-semibold text-slate-700 bg-white/80 backdrop-blur-xs px-2.5 py-1 rounded-full shadow-xs border border-slate-300">
                <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>স্ট্যান্ডার্ড A4 পেপার প্রিভিউ</span>
              </span>

              {config.isBatchMode && (
                <span className="text-xs bg-amber-100 text-amber-900 border border-amber-300 font-bold px-2 py-0.5 rounded-full">
                  পৃষ্ঠা: {currentPage + 1} / {totalPages}
                </span>
              )}
            </div>

            {/* Batch page switcher if multiple pages */}
            {config.isBatchMode && totalPages > 1 && (
              <div className="flex items-center space-x-1 bg-white rounded-lg p-1 border border-slate-300 shadow-xs">
                <button
                  disabled={currentPage === 0}
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  title="Previous Page"
                >
                  <ChevronLeft className="w-4 h-4 text-slate-700" />
                </button>
                <span className="text-xs font-mono font-bold px-2 text-slate-700">
                  {currentPage + 1} of {totalPages}
                </span>
                <button
                  disabled={currentPage >= totalPages - 1}
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  className="p-1 rounded hover:bg-slate-100 disabled:opacity-30 cursor-pointer"
                  title="Next Page"
                >
                  <ChevronRight className="w-4 h-4 text-slate-700" />
                </button>
                <div className="h-4 w-px bg-slate-200 mx-1" />
                <button
                  onClick={() => setViewAllBatchPages(!viewAllBatchPages)}
                  className={`text-[11px] px-2 py-0.5 rounded font-semibold ${
                    viewAllBatchPages
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {viewAllBatchPages ? 'একক পৃষ্ঠা' : 'সব পাতা একসাথে'}
                </button>
              </div>
            )}
          </div>

          {/* OMR Sheet Rendering Viewport with Zoom */}
          <div className="flex-1 flex flex-col items-center justify-start pb-12">
            <div
              style={{
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top center',
                transition: 'transform 0.15s ease-out',
              }}
              className="omr-zoom-wrapper flex flex-col items-center space-y-8"
            >
              {config.isBatchMode ? (
                Array.from({ length: totalPages }).map((_, idx) => {
                  const student = batchStudents[idx];
                  const isVisibleOnScreen = viewAllBatchPages || idx === currentPage;
                  return (
                    <div
                      key={idx}
                      id={idx === currentPage ? 'omr-active-sheet' : undefined}
                      ref={idx === currentPage ? sheetCaptureRef : undefined}
                      className={`omr-print-page ${isVisibleOnScreen ? 'block' : 'hidden print:block'}`}
                    >
                      {config.sheetMode === 'mcq_only' ? (
                        <McqOmrSheet config={config} student={student} pageIndex={idx} />
                      ) : (
                        <OmrSheet config={config} student={student} pageIndex={idx} />
                      )}
                    </div>
                  );
                })
              ) : (
                <div id="omr-active-sheet" ref={sheetCaptureRef} className="omr-print-page block">
                  {config.sheetMode === 'mcq_only' ? (
                    <McqOmrSheet
                      config={config}
                      student={batchStudents[0]}
                      pageIndex={0}
                    />
                  ) : (
                    <OmrSheet
                      config={config}
                      student={batchStudents[0]}
                      pageIndex={0}
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Batch Generator Modal */}
      <BatchModal
        isOpen={isBatchModalOpen}
        onClose={() => setIsBatchModalOpen(false)}
        onApplyBatch={handleApplyBatch}
        initialRoll={config.startRoll}
        initialReg={config.startReg}
        initialSerial={config.startSerial}
      />

      {/* Print & PDF Download Action Modal */}
      <PrintDownloadModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        onDownloadPdf={async () => {
          await handleDownloadPdf();
          setIsPrintModalOpen(false);
        }}
        onDownloadImage={async () => {
          await handleDownloadImage();
          setIsPrintModalOpen(false);
        }}
        onTriggerPrint={() => {
          handleTriggerPrint();
        }}
        isProcessing={isExporting}
        statusText={exportStatusText}
        sheetTitle={`${config.boardName} - ${config.examName}`}
      />
    </div>
  );
}
