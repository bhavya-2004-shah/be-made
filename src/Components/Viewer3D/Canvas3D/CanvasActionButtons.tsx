import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import type { RefObject } from "react";
import { useMainContext } from "../../../hooks/useMainContext";
import { Save, Share2, Maximize2 } from "lucide-react";

type Props = {
  containerRef: RefObject<HTMLDivElement | null>;
};

export const CanvasActionButtons = observer(({ containerRef }: Props) => {
  const stateManager = useMainContext();
  const [isSaving, setIsSaving] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

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

  const buildShareUrl = () => {
    const params = new URLSearchParams();

    const baseShapeId = design.baseShapeManager.selectedBaseShape?.id;
    const baseColorId = design.baseColorManager.selectedBaseColor?.id;
    const topShapeId = design.tableTopManager.selectedTableTop;
    const textureId = design.tableTextureManager.selectedTexture;
    const chairId = design.chairManager.selectedChair?.id;
    const chairColorId = design.chairColorManager.selectedChairColor?.id;
    const chairCount = design.chairCountManager.count;
    const topLength = design.dimensionManager.topLength;
    const topWidth = design.dimensionManager.topWidth;
    const cameraView = design.cameraView;

    if (baseShapeId) params.set("base", baseShapeId);
    if (baseColorId) params.set("baseColor", baseColorId);
    if (topShapeId) params.set("top", topShapeId);
    if (textureId) params.set("texture", textureId);
    if (chairId) params.set("chair", chairId);
    if (chairColorId) params.set("chairColor", chairColorId);
    if (Number.isFinite(chairCount)) params.set("chairs", String(chairCount));
    if (Number.isFinite(topLength)) params.set("len", String(topLength));
    if (Number.isFinite(topWidth)) params.set("wid", String(topWidth));
    if (cameraView) params.set("view", cameraView);

    const query = params.toString();
    const baseUrl = `${window.location.origin}${window.location.pathname}`;
    return query ? `${baseUrl}?${query}` : baseUrl;
  };

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

  const copyShareLink = async () => {
    const shareUrl = buildShareUrl();
    const copyWithClipboardApi = async () => {
      if (!navigator.clipboard?.writeText) return false;
      try {
        await navigator.clipboard.writeText(shareUrl);
        return true;
      } catch {
        return false;
      }
    };

    const copyWithTextareaFallback = () => {
      try {
        const textarea = document.createElement("textarea");
        textarea.value = shareUrl;
        textarea.setAttribute("readonly", "true");
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        const copied = document.execCommand("copy");
        document.body.removeChild(textarea);
        return copied;
      } catch {
        return false;
      }
    };

    const copied = (await copyWithClipboardApi()) || copyWithTextareaFallback();
    setShareCopied(copied);
    if (copied) {
      window.setTimeout(() => setShareCopied(false), 1600);
    }
  };

  const handleShare = async () => {
    const shareUrl = buildShareUrl();

    try {
      if (navigator.share) {
        await navigator.share({
          title: "BeMade Table Design",
          url: shareUrl,
        });
        return;
      }
    } catch {
      // fall through to modal
    }

    setIsShareOpen(true);
    setShareCopied(false);
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
      {isShareOpen && (
        <div className="absolute inset-0 z-40 flex items-center justify-center bg-black/50">
          <div className="w-[90%] max-w-xl rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Share your design
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  Share this link with others to show them your current configuration.
                </p>
              </div>
              <button
                type="button"
                aria-label="Close"
                title="Close"
                onClick={() => setIsShareOpen(false)}
                className="text-gray-500 hover:text-gray-800 transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-center">
              <input
                className="h-12 flex-1 rounded-xl border border-gray-200 px-4 text-sm text-gray-700"
                value={buildShareUrl()}
                readOnly
              />
              <button
                type="button"
                onClick={copyShareLink}
                className="h-12 rounded-xl bg-black px-5 text-sm font-semibold text-white hover:bg-gray-900 transition"
              >
                {shareCopied ? "Copied" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      )}

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
    <Save size={18} />
  </button>

  <button
    type="button"
    aria-label="Share"
    title="Share"
    onClick={handleShare}
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition"
  >
    <Share2 size={18} />
  </button>

  <button
    type="button"
    aria-label="Fullscreen"
    title="Fullscreen"
    onClick={handleFullscreen}
    className="flex h-10 w-10 items-center justify-center rounded-xl border border-gray-300 bg-gray-100 text-gray-700 shadow-sm hover:bg-gray-200 transition"
  >
    <Maximize2 size={18} />
  </button>
</div>

    </>
  );
});
