import { observer } from "mobx-react-lite";
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../hooks/useMainContext";
import type { TableTopColorJson } from "../../types";

type SampleOrderItem = {
  id: string;
  name: string;
  image: string;
  description: string;
};

const SAMPLE_ORDER_KEY = "bemade:sampleOrder";

const calculateSamplePrice = (count: number) => Math.ceil(count / 2) * 20;

export const OrderSampleContent = observer(() => {
  const navigate = useNavigate();
  const stateManager = useMainContext();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [hoveredTexture, setHoveredTexture] = useState<TableTopColorJson | null>(null);
  const [hoverPreviewPos, setHoverPreviewPos] = useState({ top: 24, left: 24 });

  const textures = stateManager.designManager.tableTextureManager.textures || [];

  const selectedTextures = useMemo(
    () => textures.filter((texture: TableTopColorJson) => selectedIds.includes(texture.id)),
    [textures, selectedIds]
  );

  const totalPrice = calculateSamplePrice(selectedIds.length);

  const toggleSelection = (textureId: string) => {
    setSelectedIds((prev) =>
      prev.includes(textureId)
        ? prev.filter((id) => id !== textureId)
        : [...prev, textureId]
    );
  };

  const handleTextureHover = (
    texture: TableTopColorJson,
    target: HTMLElement
  ) => {
    const rect = target.getBoundingClientRect();

    const previewWidth = 380;
    const previewHeight = 760;
    const gap = 12;
    const viewportPadding = 12;

    let left = rect.left - previewWidth - gap;
    if (left < viewportPadding) {
      left = rect.right + gap;
    }

    left = Math.max(
      viewportPadding,
      Math.min(left, window.innerWidth - previewWidth - viewportPadding)
    );

    let top = rect.top - 8;
    top = Math.max(
      viewportPadding,
      Math.min(top, window.innerHeight - previewHeight - viewportPadding)
    );

    setHoverPreviewPos({ top, left });
    setHoveredTexture(texture);
  };

  const handleCheckout = () => {
    if (selectedTextures.length === 0) return;

    const items: SampleOrderItem[] = selectedTextures.map((texture: TableTopColorJson) => ({
      id: texture.id,
      name: texture.name,
      image: texture.sample_previewUrl,
      description: texture.description,
    }));

    localStorage.setItem(
      SAMPLE_ORDER_KEY,
      JSON.stringify({
        items,
        quantity: items.length,
        totalPrice,
        createdAt: Date.now(),
      })
    );

    navigate("/place-order");
  };

  return (
    <div className="space-y-8 pb-28">
      <div className="bg-gray-100 rounded-xl p-5 text-gray-700 text-sm leading-relaxed">
        <h3 className="font-semibold text-base mb-3">Sample Pricing</h3>
          <ul className="list-disc ml-5 space-y-1">
          <li>A pair of samples costs £20.</li>
          <li>Ordering just one sample is also £20.</li>
          <li>
            For more than two samples, it costs £20 for every
            additional pair. A single extra sample also counts as
            a full pair.
          </li>
          <li>Please select your samples below:</li>
        </ul>
      </div>

      <div>
        <h3 className="text-lg font-semibold mb-4">Select Samples</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {textures.map((texture: TableTopColorJson) => {
            const isSelected = selectedIds.includes(texture.id);

            return (
              <div
                key={texture.id}
                className="space-y-2 relative"
                onMouseEnter={(e) => handleTextureHover(texture, e.currentTarget)}
                onMouseLeave={() =>
                  setHoveredTexture((prev) => (prev?.id === texture.id ? null : prev))
                }
              >
                <button
                  type="button"
                  onClick={() => toggleSelection(texture.id)}
                  className={`relative w-full aspect-square rounded-xl overflow-hidden border transition ${
                    isSelected ? "ring-2 ring-black border-black" : "hover:ring-2 ring-black"
                  }`}
                >
                  {texture.sample_previewUrl ? (
                    <img
                      src={texture.sample_previewUrl}
                      alt={texture.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-xs text-gray-500 px-2 text-center">
                      Preview unavailable
                    </div>
                  )}
                  {isSelected && (
                    <span className="absolute right-2 top-2 rounded-full bg-black px-2 py-1 text-xs text-white">
                      Selected
                    </span>
                  )}
                </button>
                <p className="text-sm text-gray-800 truncate">{texture.name}</p>
              </div>
            );
          })}
        </div>
      </div>

      {hoveredTexture && (
        <div
          className="pointer-events-none fixed z-[70]"
          style={{
            top: hoverPreviewPos.top,
            left: hoverPreviewPos.left,
            width: 380,
          }}
        >
          <div className="w-full rounded-2xl bg-[#efefef] p-3 shadow-2xl">
            <div className="overflow-hidden rounded-xl bg-white">
              <img
                src={hoveredTexture.sample_previewUrl}
                alt={hoveredTexture.name}
                className="h-[640px] w-full object-cover"
              />
            </div>
            <div className="px-2 pt-3 pb-1">
              <h4 className="text-3xl font-semibold text-gray-900">{hoveredTexture.name}</h4>
              <p className="mt-1 text-base leading-6 text-gray-700">{hoveredTexture.description}</p>
            </div>
          </div>
        </div>
      )}

      <div className=" bottom-0 z-30 -mx-6 border-t border-gray-200 bg-white/95 px-6 pt-4 pb-3 backdrop-blur">
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <p>{selectedIds.length} sample(s) selected</p>
            <p className="font-semibold">Total: GBP {totalPrice}</p>
          </div>

          <button
            type="button"
            onClick={handleCheckout}
            disabled={selectedIds.length === 0}
            className={`min-w-[140px] px-8 py-3 rounded-full text-sm font-medium ${
              selectedIds.length === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-black text-white"
            }`}
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
});
