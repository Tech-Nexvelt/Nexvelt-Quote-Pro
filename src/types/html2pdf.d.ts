declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: 'jpeg' | 'png' | 'webp' | string; quality?: number };
    html2canvas?: { scale?: number; useCORS?: boolean; logging?: boolean };
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: 'portrait' | 'landscape' };
  }

  interface Html2PdfChain {
    from(element: HTMLElement | string): Html2PdfChain;
    set(options: Html2PdfOptions): Html2PdfChain;
    save(): Promise<void>;
    outputPdf(type?: string): Promise<any>;
  }

  function html2pdf(): Html2PdfChain;
  function html2pdf(element: HTMLElement | string, options?: Html2PdfOptions): Promise<void>;

  export default html2pdf;
}
