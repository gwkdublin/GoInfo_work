import React, { useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface PdfExportFooterProps {
  elementId: string;
  reportTitle: string;
  fileNamePrefix?: string;
  subtitle?: string;
}

const PdfExportFooter: React.FC<PdfExportFooterProps> = ({
  elementId,
  reportTitle,
  fileNamePrefix = 'Raport_CarbonBiz',
  subtitle = 'Pobierz pełną zawartość bieżącego ekranu w formacie PDF lub użyj systemowego drukowania.'
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleGeneratePdf = async () => {
    setIsGenerating(true);
    setStatusMessage('Przygotowywanie dokumentu...');

    try {
      const targetElement = document.getElementById(elementId) || document.body;
      
      // Temporarily ensure full height capture
      const originalStyleHeight = targetElement.style.height;
      const originalStyleOverflow = targetElement.style.overflow;

      targetElement.style.height = 'auto';
      targetElement.style.overflow = 'visible';

      setStatusMessage('Generowanie podglądu graficznego (DPI 2x)...');

      const canvas = await html2canvas(targetElement, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
        windowWidth: targetElement.scrollWidth || 1200,
        ignoreElements: (el) => el.classList.contains('no-print')
      });

      // Restore styles
      targetElement.style.height = originalStyleHeight;
      targetElement.style.overflow = originalStyleOverflow;

      setStatusMessage('Tworzenie wielostronicowego pliku PDF (A4)...');

      const imgData = canvas.toDataURL('image/jpeg', 0.95);
      const pdf = new jsPDF('p', 'mm', 'a4');

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 0;

      // First page
      pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      // Subsequent pages if long
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'JPEG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }

      const dateStr = new Date().toISOString().split('T')[0];
      const safeTitle = reportTitle.replace(/[^a-zA-Z0-9ąĆęŁńÓśŹŻąćęłnósźż_-]/g, '_');
      const finalFileName = `${fileNamePrefix}_${safeTitle}_${dateStr}.pdf`;

      setStatusMessage('Zapisywanie pliku w lokalnej pamięci / dysku...');
      pdf.save(finalFileName);

      setStatusMessage('✅ Plik PDF został pomyślnie wygenerowany i pobrany!');
      setTimeout(() => setStatusMessage(null), 5000);
    } catch (err: any) {
      console.error('Błąd generowania PDF:', err);
      setStatusMessage('❌ Wystąpił błąd podczas generowania pliku PDF: ' + (err?.message || 'Nieznany błąd'));
      setTimeout(() => setStatusMessage(null), 6000);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleNativePrint = () => {
    window.print();
  };

  return (
    <div className="no-print mt-12 bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800 text-white p-6 md:p-8 rounded-3xl shadow-xl border border-slate-700/60 relative overflow-hidden">
      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="flex items-center space-x-2">
            <span className="p-1.5 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-bold uppercase tracking-wider border border-emerald-500/30">
              Eksport Raportu PDF
            </span>
            <span className="text-xs text-gray-400 font-mono">
              {reportTitle}
            </span>
          </div>
          <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white">
            Pobierz lub zapisz zawartość ekranu w pliku PDF
          </h3>
          <p className="text-xs md:text-sm text-gray-300 leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3 shrink-0">
          <button
            onClick={handleGeneratePdf}
            disabled={isGenerating}
            className="px-5 py-3 bg-[#00915a] hover:bg-[#007045] text-white rounded-2xl font-bold text-sm shadow-lg hover:shadow-emerald-900/30 transition-all flex items-center space-x-2.5 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            {isGenerating ? (
              <>
                <svg className="animate-spin w-5 h-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generowanie PDF...</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>Pobierz plik PDF</span>
              </>
            )}
          </button>

          <button
            onClick={handleNativePrint}
            disabled={isGenerating}
            className="px-4 py-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl font-bold text-sm border border-white/20 transition-all flex items-center space-x-2 active:scale-95"
          >
            <svg className="w-5 h-5 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            <span>Drukuj / Zapisz w systemie</span>
          </button>
        </div>
      </div>

      {statusMessage && (
        <div className="mt-4 pt-3 border-t border-white/10 text-xs font-semibold text-emerald-300 animate-fadeIn flex items-center space-x-2">
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Subtle decoration background glow */}
      <div className="absolute right-[-10%] bottom-[-50%] w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>
    </div>
  );
};

export default PdfExportFooter;
