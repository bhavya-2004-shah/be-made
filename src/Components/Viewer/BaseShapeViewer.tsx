import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";


export const BaseShapeViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { baseShapeManager } = designManager;

  const baseShapes = baseShapeManager.baseShapes;
  const selected = baseShapeManager.selectedBaseShape;

  return (
    <div className="flex  w-full">
    
      {/* <div className="w-[65%] bg-white">
  <Viewer3D />
</div> */}


      {/* ================= RIGHT SIDE (35% - selector panel) ================= */}
      <div className="w-fullbg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-6 py-5">
          {/* Title */}
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Choose Base
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-6 text-center">
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
                        h-32 flex items-center justify-center
                        transition
                        ${isSelected ? "ring-2 ring-gray-900" : ""}
                      `}
                    >
                      {/* Small preview */}
                      <img
                        src={shape.preview}
                        alt={shape.name}
                        className=" w-auto object-contain opacity-90"
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
