import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const DimensionsViewer = observer(() => {
  const stateManager = useMainContext();
  const dimensionManager =
    stateManager.designManager.dimensionManager;

  const baseType =
    stateManager.designManager.tableTopManager.selectedTableTop;

  const {
    topLength,
    topWidth,
    setTopLength,
    setTopWidth,
    minLength,
    maxLength,
    minWidth,
    maxWidth,
  } = dimensionManager;

  const step = 50;

  const isRound = baseType === "round";
  const isSquare = baseType === "square";

  const sliderClass =
    "flex-1 appearance-none h-2 rounded-full bg-gradient-to-r from-blue-200 to-amber-200 outline-none";

  const btnClass =
    "w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center text-lg font-medium bg-white hover:bg-gray-50";

  return (
    <div className="w-full  bg-gray-50 border-l border-gray-200 p-6">
      <h2 className="text-3xl font-semibold mb-4 text-gray-900">
        Dimensions
      </h2>

      {/* Info box */}
      <div className="bg-white shadow-sm rounded-xl p-4 text-sm mb-8 flex items-center gap-3 border border-gray-200">
        <div className="w-6 h-6 rounded bg-gray-700 text-white flex items-center justify-center text-xs">
          i
        </div>
        <p className="text-gray-700">
          All table heights are fixed between{" "}
          <span className="font-semibold">
            730mm to 750mm
          </span>
        </p>
      </div>

      {/* ================= ROUND ================= */}
      {isRound && (
        <div className="mb-10">
          <p className="font-semibold text-lg mb-4">
            Top Diameter
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setTopLength(
                  Math.max(minLength, topLength - step)
                )
              }
              className={btnClass}
            >
              −
            </button>

            <input
              type="range"
              min={minLength}
              max={maxLength}
              value={topLength}
              onChange={(e) =>
                setTopLength(Number(e.target.value))
              }
              className={sliderClass}
            />

            <button
              onClick={() =>
                setTopLength(
                  Math.min(maxLength, topLength + step)
                )
              }
              className={btnClass}
            >
              +
            </button>
          </div>

          <p className="text-center mt-4 text-gray-900 font-medium">
            {topLength}mm
          </p>
        </div>
      )}

      {/* ================= SQUARE ================= */}
      {isSquare && (
        <div className="mb-10">
          <p className="font-semibold text-lg mb-4">
            Length / Width
          </p>

          <div className="flex items-center gap-4">
            <button
              onClick={() =>
                setTopLength(
                  Math.max(minLength, topLength - step)
                )
              }
              className={btnClass}
            >
              −
            </button>

            <input
              type="range"
              min={minLength}
              max={maxLength}
              value={topLength}
              onChange={(e) => {
                const value = Number(e.target.value);
                setTopLength(value);
                setTopWidth(value);
              }}
              className={sliderClass}
            />

            <button
              onClick={() =>
                setTopLength(
                  Math.min(maxLength, topLength + step)
                )
              }
              className={btnClass}
            >
              +
            </button>
          </div>

          <p className="text-center mt-4 text-gray-900 font-medium">
            {topLength} × {topLength} mm
          </p>
        </div>
      )}

      {/* ================= RECTANGULAR TYPES ================= */}
      {!isRound && !isSquare && (
        <>
          {/* LENGTH */}
          <div className="mb-10">
            <p className="font-semibold text-lg mb-4">
              Top Length
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setTopLength(
                    Math.max(minLength, topLength - step)
                  )
                }
                className={btnClass}
              >
                −
              </button>

              <input
                type="range"
                min={minLength}
                max={maxLength}
                value={topLength}
                onChange={(e) =>
                  setTopLength(Number(e.target.value))
                }
                className={sliderClass}
              />

              <button
                onClick={() =>
                  setTopLength(
                    Math.min(maxLength, topLength + step)
                  )
                }
                className={btnClass}
              >
                +
              </button>
            </div>

            <p className="text-center mt-4 text-gray-900 font-medium">
              {topLength}mm
            </p>
          </div>

          {/* WIDTH */}
          <div>
            <p className="font-semibold text-lg mb-4">
              Top Width
            </p>

            <div className="flex items-center gap-4">
              <button
                onClick={() =>
                  setTopWidth(
                    Math.max(minWidth, topWidth - step)
                  )
                }
                className={btnClass}
              >
                −
              </button>

              <input
                type="range"
                min={minWidth}
                max={maxWidth}
                value={topWidth}
                onChange={(e) =>
                  setTopWidth(Number(e.target.value))
                }
                className={sliderClass}
              />

              <button
                onClick={() =>
                  setTopWidth(
                    Math.min(maxWidth, topWidth + step)
                  )
                }
                className={btnClass}
              >
                +
              </button>
            </div>

            <p className="text-center mt-4 text-gray-900 font-medium">
              {topWidth}mm
            </p>
          </div>
        </>
      )}
    </div>
  );
});
