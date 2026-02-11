import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { useMainContext } from "../../../hooks/useMainContext";
import type { CameraViewType } from "./cameraConfig";

const BASE_VIEW_BUTTONS: Array<{ value: CameraViewType; label: string }> = [
  { value: "front", label: "Front" },
  { value: "leftSide", label: "Left Side" },
  { value: "top", label: "Top" },
  { value: "rightSide", label: "Right Side" },
];

const CHAIR_VIEW_BUTTONS: Array<{ value: CameraViewType; label: string }> = [
  { value: "twoChairView", label: "Two Chair View" },
  { value: "rightChairView", label: "Right Chair View" },
  { value: "topChairView", label: "Top Chair View" },
];

export const CameraViewButtons = observer(() => {
  const stateManager = useMainContext();
  const activeView = stateManager.designManager.cameraView;
  const chairCount = stateManager.designManager.chairCountManager.count;
  const showChairViews = chairCount > 0;
  const viewButtons = showChairViews
    ? [...BASE_VIEW_BUTTONS, ...CHAIR_VIEW_BUTTONS]
    : BASE_VIEW_BUTTONS;

  useEffect(() => {
    if (!showChairViews && CHAIR_VIEW_BUTTONS.some((btn) => btn.value === activeView)) {
      stateManager.designManager.setCameraView("front");
    }
  }, [activeView, showChairViews, stateManager]);

  const activeIndex = Math.max(
    0,
    viewButtons.findIndex((btn) => btn.value === activeView)
  );

  const goToPrevView = () => {
    const prevIndex =
      (activeIndex - 1 + viewButtons.length) % viewButtons.length;
    stateManager.designManager.setCameraView(viewButtons[prevIndex].value);
  };

  const goToNextView = () => {
    const nextIndex = (activeIndex + 1) % viewButtons.length;
    stateManager.designManager.setCameraView(viewButtons[nextIndex].value);
  };

  return (
    <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-4 rounded-full bg-black/20 px-4 py-2 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Previous view"
        title="Previous view"
        onClick={goToPrevView}
        className="flex h-6 w-6 items-center justify-center text-gray-700 transition-colors hover:text-gray-900"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>

      {viewButtons.map((btn) => {
        const isActive = activeView === btn.value;

        return (
          <button
            key={btn.value}
            type="button"
            aria-label={btn.label}
            title={btn.label}
            onClick={() => stateManager.designManager.setCameraView(btn.value)}
            className={`h-4 w-4 rounded-full transition-all ${
              isActive
                ? "scale-110 bg-gray-700"
                : "bg-white hover:scale-105"
            }`}
          />
        );
      })}

      <button
        type="button"
        aria-label="Next view"
        title="Next view"
        onClick={goToNextView}
        className="flex h-6 w-6 items-center justify-center text-gray-700 transition-colors hover:text-gray-900"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>
    </div>
  );
});
