import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const TableTextureViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { tableTextureManager } = designManager;

  const textures = tableTextureManager.textures || [];
  const selected = tableTextureManager.selectedTextureData;

  // Group textures
  const naturalTextures = textures.filter(
    (t) => t.className === "Natural"
  );

  const polishTextures = textures.filter(
    (t) => t.className === "Polish"
  );

  const silkTextures = textures.filter(
    (t) => t.className === "Silk"
  );

  const renderGrid = (items: any[]) => (
    <div className="grid grid-cols-3 gap-6 text-center">
      {items.map((texture) => {
        const isSelected = selected?.id === texture.id;

        return (
          <div
            key={texture.id}
            onClick={() =>
              tableTextureManager.setSelectedTexture(texture.id)
            }
            className="cursor-pointer"
          >
            {/* Card */}
            <div
              className={`
                relative rounded-2xl bg-gray-100
                h-32 flex items-center justify-center
                transition
                ${isSelected ? "ring-2 ring-gray-900" : ""}
              `}
            >
              {/* Preview */}
              <img
                src={texture.previewUrl}
                alt={texture.name}
                className="w-full h-full object-cover rounded-2xl"
              />

              {/* Selected check */}
              {isSelected && (
                <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
              )}
            </div>

            {/* Name */}
            <p className="mt-2 text-sm text-gray-900 font-medium">
              {texture.name}
            </p>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="flex  w-full">
      {/* ================= RIGHT SIDE PANEL ================= */}
      <div className="w-full bg-white border-l border-gray-200">
        <div className="px-6 ">
          {/* NATURAL */}
          {naturalTextures.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Natural
              </h2>
              {renderGrid(naturalTextures)}
            </div>
          )}

          {/* POLISH */}
          {polishTextures.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Polish
              </h2>
              {renderGrid(polishTextures)}
            </div>
          )}

          {/* SILK */}
          {silkTextures.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-6 text-gray-900">
                Silk
              </h2>
              {renderGrid(silkTextures)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
