import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const TableTopViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;
  const { tableTopManager } = designManager;

  const tableTops = tableTopManager.tableTops;
  const selected = tableTopManager.selectedTableTopData;
  const allowed = tableTopManager.allowedShapes
  console.log(allowed)

  return (
    <div className="flex  w-full">
      {/* ================= RIGHT SIDE (35% - selector panel) ================= */}
      <div className="w-full bg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-6 py-5">
          {/* Title */}
          <h2 data-nav-anchor className="text-xl font-semibold mb-6 text-gray-900">
            Choose Tabletop
          </h2>

          {/* Grid */}
          <div className="grid grid-cols-3 gap-6 text-center">
            {tableTops &&
              tableTops.map((top) => {
                const isSelected = selected?.id === top.id;
                  const isAllowed =
                  allowed.length === 0 || allowed.includes(top.id);
                  console.log(isAllowed)

                return (
                  <div
                    key={top.id}
                    onClick={() =>
                      tableTopManager.setSelectedTableTop(top.id)
                      
                    }
                      className={`${
                      isAllowed ? "cursor-pointer" : "cursor-not-allowed"
                    }`}
                  >
                    {/* Card */}
                    <div
                      className={`
                        relative rounded-2xl bg-gray-100
                        h-32 flex items-center justify-center
                        transition
                        ${isSelected ? "ring-2 ring-gray-900" : ""}
                        ${
                          isAllowed
                            ? "bg-gray-100"
                            : "bg-gray-200 opacity-50"
                        }
                      `}
                    >
                      {/* Preview */}
                      <img
                        src={top.preview}
                        alt={top.label}
                        className="w-auto h-full object-contain opacity-90"
                      />

                      {/* Selected check */}
                      {isSelected && (
                        <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center">
                          <span className="text-white text-xs">✓</span>
                        </div>
                      )}
                    </div>

                    {/* Label */}
                     {/* Label */}
                    <p
                      className={`mt-2 text-sm font-medium ${
                        isAllowed
                          ? "text-gray-900"
                          : "text-gray-400"
                      }`}
                    >
                      {top.label}
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

