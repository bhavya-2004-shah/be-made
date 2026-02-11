import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const ChairColorViewer = observer(() => {
  const stateManager = useMainContext();
  const designManager = stateManager.designManager;

  const { chairManager, chairColorManager } = designManager;

  // Selected chair
  const selectedChair = chairManager.selectedChair;
  //   console.log("the debug of thre color in chairs " , selectedChair)

  // Colors from color manager
  const chairColors = chairColorManager.colors;
  console.log("the debug of thre color in chairs ", chairColors);

  // Currently selected color
  const selectedColor = chairColorManager.selectedChairColor;
  console.log("ttetetetttete", selectedColor);

  return (
    <div className="flex w-full">
      {/* ================= RIGHT SIDE (35% - selector panel) ================= */}
      <div className="w-full bg-white border-l border-gray-200 overflow-y-auto">
        <div className="px-6 py-5">
          {/* Title */}
          <h2 className="text-xl font-semibold mb-6 text-gray-900">
            Choose Chair Color
          </h2>

          {/* Grid */}
          <div className=" flex flex-wrap   text-center">
            {(!selectedChair || chairColors.length === 0) && (
              <p className="text-gray-500   col-span-3">
                Please select a chair first.
              </p>
            )}

            {chairColors.map((color: any) => {
              const isSelected = selectedColor?.id === color.id;

              return (
                <div
                  key={color.id}
                  onClick={() => chairColorManager.setSelectedChairColor(color)}
                  className="cursor-pointer px-5"
                >
                  {/* Card */}
                  <div
                    className={`relative w-5 h-5 mx-auto
    rounded-full overflow-hidden
    transition
    ${isSelected ? "ring-2 ring-gray-900" : "ring-1 ring-gray-300"}`}
                  >
                    {/* Color Preview */}
                    <img
                      src={color.previewUrl}
                      alt={color.name}
                      className="w-full h-full object-cover"
                    />

                    {/* Selected check */}
                    {isSelected && (
                      <div className="absolute top-1 right-1  rounded-full bg-gray-900 flex items-center justify-center">
                        <span className="text-white text-xs"></span>
                      </div>
                    )}
                  </div>

                  {/* Name */}
                  <p className="mt-2 text-sm text-gray-900 font-medium">
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
