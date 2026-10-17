import jsPDF from 'jspdf';
import { toJpeg, toPng } from 'html-to-image';
import { BENGALI_FONT_EMBED_CSS } from './embeddedFonts';

export interface ExportProgress {
  isExporting: boolean;
  statusText: string;
}

/**
 * Downloads a DOM element as a high-resolution A4 PDF file using modern html-to-image
 * with embedded Bengali fonts for 100% authentic rendering without jumbled text.
 */
export const downloadAsPdf = async (
  element: HTMLElement,
  fileName: string = 'OMR_Sheet_2026.pdf',
  onProgress?: (progress: ExportProgress) => void
): Promise<boolean> => {
  try {
    onProgress?.({ isExporting: true, statusText: 'বাংলা ফন্ট ও পেজ রেন্ডার হচ্ছে...' });

    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Convert DOM element to high-res JPEG image data with embedded Bengali fonts
    // fontEmbedCSS bypasses reading document.styleSheets (fixing SecurityError)
    // and provides genuine base64 Bengali font glyphs (fixing jumbled letters)
    const imgData = await toJpeg(element, {
      quality: 0.98,
      pixelRatio: 2.2,
      backgroundColor: '#ffffff',
      cacheBust: false,
      fontEmbedCSS: BENGALI_FONT_EMBED_CSS,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    onProgress?.({ isExporting: true, statusText: 'A4 সাইজ পিডিএফ ফাইলে সংরক্ষণ হচ্ছে...' });

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    // Standard A4 dimensions: 210 x 297 mm
    pdf.addImage(imgData, 'JPEG', 0, 0, 210, 297, undefined, 'FAST');
    pdf.save(fileName);

    onProgress?.({ isExporting: false, statusText: 'পিডিএফ ডাউনলোড সম্পন্ন হয়েছে!' });
    return true;
  } catch (error) {
    console.error('PDF export failed:', error);
    onProgress?.({ isExporting: false, statusText: 'পিডিএফ তৈরি ব্যর্থ হয়েছে' });
    return false;
  }
};

/**
 * Downloads a DOM element as a crisp PNG image using html-to-image with embedded Bengali fonts
 */
export const downloadAsImage = async (
  element: HTMLElement,
  fileName: string = 'OMR_Sheet_2026.png',
  onProgress?: (progress: ExportProgress) => void
): Promise<boolean> => {
  try {
    onProgress?.({ isExporting: true, statusText: 'হাই-রেজোলিউশন ছবি তৈরি হচ্ছে...' });

    if (document.fonts) {
      await document.fonts.ready;
    }
    await new Promise((resolve) => setTimeout(resolve, 100));

    const dataUrl = await toPng(element, {
      pixelRatio: 2.2,
      backgroundColor: '#ffffff',
      cacheBust: false,
      fontEmbedCSS: BENGALI_FONT_EMBED_CSS,
      width: element.scrollWidth,
      height: element.scrollHeight,
    });

    const link = document.createElement('a');
    link.download = fileName;
    link.href = dataUrl;
    link.click();

    onProgress?.({ isExporting: false, statusText: 'ছবি ডাউনলোড সম্পন্ন হয়েছে!' });
    return true;
  } catch (error) {
    console.error('Image export failed:', error);
    onProgress?.({ isExporting: false, statusText: 'ছবি তৈরি ব্যর্থ হয়েছে' });
    return false;
  }
};

/**
 * Safe in-page print handler
 */
export const safePrint = (): boolean => {
  try {
    window.print();
    return true;
  } catch (err) {
    console.warn('Direct window.print() was blocked:', err);
    return false;
  }
};
