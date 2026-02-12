import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useMainContext } from "../../hooks/useMainContext";

export const OrderSampleContent = observer(() => {
  const stateManager = useMainContext();
  const [selectedTexture, setSelectedTexture] = useState<any | null>(null);

  const textures =
    stateManager.designManager.tableTextureManager.textures || [];

  useEffect(() => {
    if (!selectedTexture) return;

    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        setSelectedTexture(null);
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [selectedTexture]);

  return (
    <div className="space-y-8">
      {/* Pricing Box */}
      <div className="bg-gray-100 rounded-xl p-5 text-gray-700 text-sm leading-relaxed">
        <h3 className="font-semibold text-base mb-3">
          Sample Pricing
        </h3>
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

      {/* Natural Section */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Natural</h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {textures.map((texture: any) => (
            <div
              key={texture.id}
              onClick={() => setSelectedTexture(texture)}
              className="aspect-square rounded-xl overflow-hidden border hover:ring-2 ring-black transition cursor-pointer"
            >
              <img
                src={texture.sample_previewUrl}
                alt={texture.name}
                className="w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Texture Preview Modal */}
      {selectedTexture && (
        <div
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/45 p-4"
          onClick={() => setSelectedTexture(null)}
        >
          <div
            className="w-full max-w-[380px] rounded-2xl bg-[#efefef] p-3 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="overflow-hidden rounded-xl bg-white">
              <img
                src={ selectedTexture.sample_previewUrl}
                alt={selectedTexture.name}
                className="h-[640px] w-full object-cover"
              />
            </div>

            <div className="px-2 pt-3 pb-1">
              <h4 className="text-3xl font-semibold text-gray-900">
                {selectedTexture.name}
              </h4>
              <p className="mt-1 text-2xl leading-7 text-gray-700">
                {selectedTexture.description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Buy Button */}
      <div className="sticky bottom-0 pt-6 bg-white">
        <div className="border-t pt-4 flex justify-end">
          <button className="bg-gray-200 text-gray-500 px-8 py-3 rounded-full text-sm font-medium">
            Buy Now →
          </button>
        </div>
      </div>
    </div>
  );
});
