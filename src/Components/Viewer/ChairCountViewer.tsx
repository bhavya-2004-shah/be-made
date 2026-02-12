import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";
import { useState } from "react";
import { PdfModal } from "./PdfModal";

export const ChairCountViewer = observer(() => {
  const stateManager = useMainContext();
  const chairCountManager =
    stateManager.designManager.chairCountManager;
  const selectedTopShape =
    stateManager.designManager.tableTopManager.selectedTableTop;

  const [open, setOpen] = useState(false);

  const isMin = chairCountManager.count <= chairCountManager.min;
  const isMax = chairCountManager.count >= chairCountManager.max;

  const shapeToPage: Record<string, number> = {
    capsule: 1,
    rectangle: 2,
    oblong: 3,
    oval: 4,
    round: 5,
    square: 5,
  };

  const pdfPage = selectedTopShape ? shapeToPage[selectedTopShape] ?? 1 : 1;

  return (
    <div className="w-full bg-white border-l border-gray-200 p-6">
      {/* Header with info button */}
      <div className="flex items-center gap-3 mb-6">
        <h2 data-nav-anchor className="text-2xl font-semibold">
          Select Chair Quantity
        </h2>

        <button
          onClick={() => setOpen(true)}
          aria-label="Open chair size chart"
          title="Open chair size chart"
          className="w-8 h-8 flex items-center justify-center rounded-md bg-black text-white text-sm font-semibold hover:bg-gray-800 transition"
        >
          i
        </button>
      </div>

      {/* Counter */}
      <div className="inline-flex rounded-xl overflow-hidden border border-gray-300">
        <button
          onClick={chairCountManager.decrease}
          disabled={isMin}
          className={`w-12 h-10 flex items-center justify-center text-xl ${
            isMin
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          −
        </button>

        <div className="w-16 h-10 flex items-center justify-center bg-gray-200 text-lg font-semibold">
          {chairCountManager.count}
        </div>

        <button
          onClick={chairCountManager.increase}
          disabled={isMax}
          className={`w-12 h-10 flex items-center justify-center text-xl ${
            isMax
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-black text-white"
          }`}
        >
          +
        </button>
      </div>

      {/* PDF Modal */}
      <PdfModal
        open={open}
        onClose={() => setOpen(false)}
        pdfPath="/assets/images/chair_size_chart.pdf"
        page={pdfPage}
      />
    </div>
  );
});
