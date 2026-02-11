import { X } from "lucide-react";

interface PdfModalProps {
  open: boolean;
  onClose: () => void;
  pdfPath: string;
  page?: number;
}

export const PdfModal = ({ open, onClose, pdfPath, page = 1 }: PdfModalProps) => {
  if (!open) return null;

  // Open a single selected page view with browser PDF UI hidden.
  const pdfSrc =
    `${pdfPath}#page=${page}&zoom=page-fit&toolbar=0&navpanes=0&scrollbar=0&view=FitH`;

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-[90%] max-w-4xl h-[80%] relative shadow-xl overflow-hidden">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-white rounded-full p-2 shadow"
        >
          <X size={20} />
        </button>

        {/* PDF Viewer */}
        <iframe
          key={page}
          src={pdfSrc}
          className="w-full h-full rounded-2xl"
          title="PDF Viewer"
        />
      </div>
    </div>
  );
};
