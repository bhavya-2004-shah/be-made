import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import type { RefObject } from "react";
import { useMainContext } from "../../../hooks/useMainContext";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
};

export const CanvasActionButtons = observer(({ containerRef }: Props) => {
  const stateManager = useMainContext();
  const [isSaving, setIsSaving] = useState(false);

  const design = stateManager.designManager;
  const selectedTexture = design.tableTextureManager.selectedTextureData;

  const summaryText = useMemo(() => {
    const topTexture = selectedTexture?.name || "-";
    const topDescription = selectedTexture?.description || "-";
    const baseShape = design.baseShapeManager.selectedBaseShape?.name || "-";
    const baseColor = design.baseColorManager.selectedBaseColor?.name || "-";
    const topShape = design.tableTopManager.selectedTableTop || "-";
    const dimensions = `${design.dimensionManager.topLength} x ${design.dimensionManager.topWidth} mm`;
    const chairType = design.chairManager.selectedChair?.name || "-";
    const chairColor = design.chairColorManager.selectedChairColor?.name || "-";
    const chairCount = design.chairCountManager.count;
    const totalPrice = design.pricingManager.totalPrice;

    return [
      "BeMade Table Design",
      "-------------------",
      `Table Top: ${topTexture}`,
      `Texture Description: ${topDescription}`,
      `Table Base: ${baseShape}`,
      `Table Base Colour: ${baseColor}`,
      `Table Top Shape: ${topShape}`,
      `Dimensions: ${dimensions}`,
      `Chair Style: ${chairType}`,
      `Chair Color: ${chairColor}`,
      `Chair Count: ${chairCount}`,
      `Total Price: ${totalPrice}`,
    ].join("\n");
  }, [design, selectedTexture]);

  const getCanvasElement = () => {
    return containerRef.current?.querySelector("canvas") || null;
  };

  const captureCanvasDataUrl = () => {
    const canvas = getCanvasElement();
    if (!canvas) return null;
    return canvas.toDataURL("image/png");
  };

  const downloadBlob = (blob: Blob, filename: string) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
      const imageDataUrl = captureCanvasDataUrl();

      if (imageDataUrl) {
        const imageRes = await fetch(imageDataUrl);
        const imageBlob = await imageRes.blob();
        downloadBlob(imageBlob, `bemade-table-${timestamp}.png`);
        localStorage.setItem("bemade:lastCapture", imageDataUrl);
      }

      const textBlob = new Blob([summaryText], { type: "text/plain" });
      downloadBlob(textBlob, `bemade-table-${timestamp}.txt`);
      localStorage.setItem("bemade:lastSummary", summaryText);
    } finally {
      setIsSaving(false);
    }
  };

  const handleShare = async () => {
    const imageDataUrl = captureCanvasDataUrl();
    const subject = "BeMade Table Design";
    const body = `${summaryText}\n\nShared from BeMade configurator.`;

    try {
      if (imageDataUrl && navigator.share) {
        const imageRes = await fetch(imageDataUrl);
        const imageBlob = await imageRes.blob();
        const imageFile = new File([imageBlob], "bemade-table.png", {
          type: "image/png",
        });

        if (navigator.canShare?.({ files: [imageFile] })) {
          await navigator.share({
            title: subject,
            text: summaryText,
            files: [imageFile],
          });
          return;
        }
      }
    } catch {
      // fallback to email
    }

    window.location.href = `mailto:?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
  };

  const handleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    if (document.fullscreenElement) {
      await document.exitFullscreen();
      return;
    }

    await container.requestFullscreen();
  };

  return (
    <>
      {/* Info button with hover popup (bottom-left) */}
      <div className="absolute left-4 bottom-4 z-30 group">
        <button
          type="button"
          aria-label="Texture info"
          title="Texture info"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition"
        >
          i
        </button>

        {/* Hover popup */}
        <div className="pointer-events-none absolute bottom-6 left-15 w-64 opacity-0 translate-y-2 rounded-xl bg-white p-3 shadow-xl border border-gray-200 transition-all duration-200 group-hover:opacity-100 group-hover:translate-y-0">
          <div className="text-sm font-semibold text-gray-900">
            {selectedTexture?.name || "No texture selected"}
          </div>
          <p className="mt-1 text-xs text-gray-700">
            {selectedTexture?.description ||
              "Texture description is not available."}
          </p>
        </div>
      </div>

      {/* Top-right action buttons */}
      <div className="absolute right-4 top-4 z-30 flex gap-2">
        <button
          type="button"
          aria-label="Save"
          title="Save"
          onClick={handleSave}
          disabled={isSaving}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition disabled:opacity-60"
        >
          💾
        </button>

        <button
          type="button"
          aria-label="Share"
          title="Share"
          onClick={handleShare}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition"
        >
          🔗
        </button>

        <button
          type="button"
          aria-label="Fullscreen"
          title="Fullscreen"
          onClick={handleFullscreen}
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition"
        >
          ⛶
        </button>
      </div>
    </>
  );
});
