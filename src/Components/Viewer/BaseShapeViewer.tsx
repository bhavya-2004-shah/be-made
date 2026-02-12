import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const BaseShapeViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { baseShapeManager } = designManager;

  const baseShapes = baseShapeManager.baseShapes;
  const selected = baseShapeManager.selectedBaseShape;

  return (
    <div className="flex w-full">
      {/* ================= RIGHT SIDE (selector panel) ================= */}
      <div className="w-full bg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-4 md:px-6 py-4 md:py-5">
          {/* Title */}
          <h2 data-nav-anchor className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-900">
            Choose Base
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-4 md:gap-6 text-center">
            {baseShapes &&
              baseShapes.map((shape: any) => {
                const isSelected = selected?.id === shape.id;

                return (
                  <div
                    key={shape.id}
                    onClick={() =>
                      baseShapeManager.setSelectedBaseShape(shape)
                    }
                    className="cursor-pointer"
                  >
                    {/* Card */}
                    <div
                      className={`text-center
                        relative rounded-2xl bg-gray-100
                        h-24 sm:h-28 md:h-32
                        flex items-center justify-center
                        transition
                        ${isSelected ? "ring-2 ring-gray-900" : ""}
                      `}
                    >
                      {/* Small preview */}
                      <img
                        src={shape.preview}
                        alt={shape.name}
                        className="max-h-full w-auto object-contain opacity-90"
                      />

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <p className="mt-2 text-xs sm:text-sm text-gray-900 font-medium">
                      {shape.name}
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
