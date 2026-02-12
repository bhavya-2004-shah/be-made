import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const ChairShapeViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { chairManager } = designManager;

  const chairs = chairManager.chairShapes;
  const selectedChair = chairManager.selectedChair;

  return (
    <div className="flex w-full">
      {/* ================= RIGHT SIDE (selector panel) ================= */}
      <div className="w-full bg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-4 md:px-6 py-4 md:py-5">
          {/* Title */}
          <h2 data-nav-anchor className="text-lg md:text-xl font-semibold mb-4 md:mb-6 text-gray-900">
            Choose Chair
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-3 gap-4 md:gap-6 text-center">
            {chairs &&
              chairs.map((chair: any) => {
                const isSelected = selectedChair?.id === chair.id;

                return (
                  <div
                    key={chair.id}
                    onClick={() => chairManager.setSelectedChair(chair)}
                    className="cursor-pointer"
                  >
                    {/* Card */}
                    <div
                      className={`relative rounded-2xl bg-gray-100
                        aspect-square
                        flex items-center justify-center
                        transition
                        ${isSelected ? "ring-2 ring-gray-900" : ""}
                      `}
                    >
                      {/* Small preview */}
                      <img
                        src={chair.previewUrl}
                        alt={chair.name}
                        className="max-h-[80%] w-auto object-contain opacity-90"
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
                      {chair.name}
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

