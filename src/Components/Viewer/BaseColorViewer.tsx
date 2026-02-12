import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const BaseColorViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { baseShapeManager, baseColorManager } = designManager;

  // Selected base shape
  const selectedBaseShape = baseShapeManager.selectedBaseShape;

  // Colors for the selected shape
  const baseColors = selectedBaseShape?.colors || [];

  // Currently selected color
  const selectedColor = baseColorManager.selectedBaseColor;

  return (
    <div className="flex py-5 w-full">
      {/* ================= RIGHT SIDE (selector panel) ================= */}
      <div className="w-full bg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-4 md:px-6">
          {/* Title */}
          <h2 data-nav-anchor className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-900">
            Choose Base Color
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-4 md:gap-6 text-center">
            {baseColors.length === 0 && (
              <p className="text-gray-500 col-span-full">
                Please select a base shape first.
              </p>
            )}

            {baseColors.map((color: any) => {
              const isSelected = selectedColor?.id === color.id;

              return (
                <div
                  key={color.id}
                  onClick={() => baseColorManager.setSelectedBaseColor(color)}
                  className="cursor-pointer flex flex-col items-center"
                >
                  {/* Card */}
                  <div
                    className={`
                      relative rounded-2xl p-1
                      inline-flex items-center justify-center
                      transition
                      ${isSelected ? "ring-2 ring-gray-900" : ""}
                    `}
                  >
                    {/* Color Preview */}
                    <img
                      src={color.preview}
                      alt={color.name}
                      className="max-h-24 w-auto object-contain opacity-90"
                    />

                    {/* Selected check */}
                    {isSelected && (
                      <div className="absolute top-1 right-1 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-xs">✓</span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="mt-2 text-xs sm:text-sm text-gray-900 font-medium">
                    {color.name}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

