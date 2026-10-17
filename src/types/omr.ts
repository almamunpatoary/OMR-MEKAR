export type ColorScheme = 'maroon' | 'black' | 'blue' | 'green';

export type SheetMode = 'board_cover' | 'mcq_only' | 'combo_cover_mcq';

export interface BatchStudent {
  roll: string;
  reg: string;
  serial: string;
  name?: string;
  subjectCode?: string;
}

export interface OmrConfig {
  boardName: string;
  subHeader: string;
  examName: string;
  examYear: string;
  examTypeOptions: string[];
  selectedExamType?: string;
  rollLength: number;
  regLength: number;
  subjectCodeLength: number;
  extraSheetLength: number;
  serialNumber: string;
  colorScheme: ColorScheme;
  watermarkText: string;
  showWatermark: boolean;
  invigilatorTitle: string;
  showBarcode: boolean;
  showQrCode: boolean;
  showPerforation: boolean;
  showBottomSection: boolean;
  bottomSectionType: 'question_grid' | 'bubble_grid' | 'both';
  questionCount: number;
  questionNumeralType: 'english' | 'bengali';
  sheetMode: SheetMode;
  mcqCount: number;
  mcqOptionType: 'bengali' | 'english';
  // Batch print settings
  isBatchMode: boolean;
  batchCount: number;
  startRoll: number;
  startReg: number;
  startSerial: number;
  // Fill mode
  blankBoxesForHandwriting: boolean; // whether digit boxes are kept completely blank for handwriting
  prefillBubbles: boolean; // whether to show filled bubbles for sample or empty for exam
}

export const DEFAULT_MADRASAH_CONFIG: OmrConfig = {
  boardName: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড, ঢাকা',
  subHeader: 'BANGLADESH MADRASAH EDUCATION BOARD, DHAKA',
  examName: 'জেডিসি/দাখিল/আলিম পরীক্ষা',
  examYear: '২০২৬',
  examTypeOptions: ['জেডিসি', 'দাখিল', 'আলিম'],
  selectedExamType: 'দাখিল',
  rollLength: 6,
  regLength: 10,
  subjectCodeLength: 3,
  extraSheetLength: 2,
  serialNumber: '1903669735',
  colorScheme: 'maroon',
  watermarkText: 'মাদ্রাসা',
  showWatermark: true,
  invigilatorTitle: 'কক্ষ পরিদর্শকের স্বাক্ষর',
  showBarcode: false,
  showQrCode: true,
  showPerforation: true,
  showBottomSection: true,
  bottomSectionType: 'question_grid',
  questionCount: 20,
  questionNumeralType: 'english',
  sheetMode: 'board_cover',
  mcqCount: 30,
  mcqOptionType: 'bengali',
  isBatchMode: false,
  batchCount: 5,
  startRoll: 124501,
  startReg: 1912456789,
  startSerial: 1903669735,
  blankBoxesForHandwriting: true,
  prefillBubbles: false,
};

export const PRESETS: { id: string; label: string; desc: string; config: Partial<OmrConfig> }[] = [
  {
    id: 'madrasah',
    label: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড (দাখিল/আলিম)',
    desc: 'হুবহু মাদ্রাসা বোর্ডের আসল ওএমআর উত্তরপত্র কভার শিট (উপর ও নিচ অংশ)',
    config: {
      boardName: 'বাংলাদেশ মাদ্রাসা শিক্ষা বোর্ড, ঢাকা',
      examName: 'জেডিসি/দাখিল/আলিম পরীক্ষা',
      examYear: '২০২৬',
      examTypeOptions: ['জেডিসি', 'দাখিল', 'আলিম'],
      selectedExamType: 'দাখিল',
      watermarkText: 'মাদ্রাসা',
      colorScheme: 'maroon',
      sheetMode: 'board_cover',
      showBottomSection: true,
    },
  },
  {
    id: 'general_board',
    label: 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড (এসএসসি/এইচএসসি)',
    desc: 'সাধারণ শিক্ষা বোর্ড (ঢাকা/রাজশাহী/কুমিল্লা ইত্যাদি) ফরম্যাট',
    config: {
      boardName: 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড, ঢাকা',
      examName: 'জেএসসি/এসএসসি/এইচএসসি পরীক্ষা',
      examYear: '২০২৬',
      examTypeOptions: ['জেএসসি', 'এসএসসি', 'এইচএসসি'],
      selectedExamType: 'এসএসসি',
      watermarkText: 'ঢাকা বোর্ড',
      colorScheme: 'maroon',
      sheetMode: 'board_cover',
      showBottomSection: true,
    },
  },
  {
    id: 'school_model_test',
    label: 'বিদ্যালয়/মাদ্রাসা মডেল টেস্ট ও বার্ষিক পরীক্ষা',
    desc: 'প্রতিষ্ঠানের নিজস্ব পরীক্ষার জন্য কাস্টমাইজড ওএমআর কভার শিট',
    config: {
      boardName: 'আইডিয়াল মডেল স্কুল ও মাদ্রাসা',
      examName: 'প্রাক-নির্বাচনী / মডেল টেস্ট পরীক্ষা',
      examYear: '২০২৬',
      examTypeOptions: ['অর্ধ-বার্ষিক', 'বার্ষিক', 'মডেল টেস্ট'],
      selectedExamType: 'মডেল টেস্ট',
      watermarkText: 'মডেল টেস্ট',
      colorScheme: 'black',
      sheetMode: 'board_cover',
      showBottomSection: true,
    },
  },
  {
    id: 'mcq_30',
    label: '৩০ নম্বরের এমসিকিউ ওএমআর শিট',
    desc: 'রোল, রেজি ও ৩০টি নৈর্ব্যক্তিক প্রশ্ন ওএমআর উত্তরপত্র',
    config: {
      boardName: 'মাধ্যমিক ও উচ্চ মাধ্যমিক শিক্ষা বোর্ড / প্রতিষ্ঠান',
      examName: 'বহুনির্বাচনী (MCQ) অভীক্ষা',
      examYear: '২৬',
      watermarkText: 'MCQ OMR',
      colorScheme: 'maroon',
      sheetMode: 'mcq_only',
      mcqCount: 30,
      mcqOptionType: 'bengali',
      showBottomSection: false,
    },
  },
  {
    id: 'mcq_100',
    label: '১০০ নম্বরের পূর্ণাঙ্গ এমসিকিউ ওএমআর শিট',
    desc: 'ভর্তি পরীক্ষা ও নিয়োগ পরীক্ষার ১০০ প্রশ্নের ওএমআর শিট',
    config: {
      boardName: 'পরীক্ষা ও মূল্যায়ন কর্তৃপক্ষ',
      examName: 'ভর্তি / নিয়োগ ও মূল্যায়ন পরীক্ষা',
      examYear: '২৬',
      watermarkText: 'EVALUATION',
      colorScheme: 'blue',
      sheetMode: 'mcq_only',
      mcqCount: 100,
      mcqOptionType: 'english',
      showBottomSection: false,
    },
  },
];
