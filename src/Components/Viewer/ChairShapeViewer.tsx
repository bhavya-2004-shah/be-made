import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const ChairShapeViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { chairManager } = designManager;

  const chairs = chairManager.chairShapes;
  const selectedChair = chairManager.selectedChair;
 
  
  return (
      <div className="flex  w-full">
      {/* ================= RIGHT SIDE (35% - selector panel) ================= */}
      <div className="w-full bg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-6 py-5">
          {/* Title */}
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Choose Chair
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-6 text-center">
            {chairs &&
              chairs.map((chair: any) => {
                  const isSelected = selectedChair?.id === chair.id;
                  
                  console.log("the chaors are here",chair.previewUrl)
                return (
                  <div
                    key={chair.id}
                    onClick={() => chairManager.setSelectedChair(chair)}
                    className="cursor-pointer"
                  >
                    {/* Card */}
                    <div
                      className={`text-center
                        relative rounded-2xl bg-gray-100
                        h-40 flex items-center justify-center
                        transition
                        ${isSelected ? "ring-2 ring-gray-900" : ""}
                      `}
                    >
                      {/* Small preview */}
                      <img
                        src={chair.previewUrl}
                        alt={chair}
                        className="w-auto object-contain opacity-90"
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
