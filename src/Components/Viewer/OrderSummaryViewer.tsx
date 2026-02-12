import { observer } from "mobx-react-lite";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../hooks/useMainContext";

export const OrderSummaryViewer = observer(() => {
  const SAMPLE_ORDER_KEY = "bemade:sampleOrder";
  const PLACE_ORDER_CAPTURE_KEY = "bemade:placeOrderRightChairCapture";
  const PLACE_ORDER_CAPTURE_EXPIRY_KEY =
    "bemade:placeOrderRightChairCaptureExpiresAt";
  const PLACE_ORDER_CAPTURE_TTL_MS = 15 * 60 * 1000;

  const navigate = useNavigate();
  const stateManager = useMainContext();

  const tableTexture =
    stateManager.designManager.tableTextureManager
      .selectedTextureData?.name;

  const baseShape =
    stateManager.designManager.baseShapeManager
      .selectedBaseShape?.name;

  const baseColor =
    stateManager.designManager.baseColorManager
      .selectedBaseColor?.name;

  const topLength =
    stateManager.designManager.dimensionManager.topLength;

  const topWidth =
    stateManager.designManager.dimensionManager.topWidth;

  const tableTop =
    stateManager.designManager.tableTopManager
      .selectedTableTop;

  const chairType =
    stateManager.designManager.chairManager
      .selectedChair?.name;

  const chairColor =
    stateManager.designManager.chairColorManager
      .selectedChairColor?.name;

  const chairQuantity =
    stateManager.designManager.chairCountManager.count;

  const tablePrice =
    stateManager.designManager.pricingManager.tablePrice;

  const chairPrice =
    stateManager.designManager.pricingManager.chairPrice;

  const totalPrice =
    stateManager.designManager.pricingManager.totalPrice;

  const waitForNextPaint = () =>
    new Promise<void>((resolve) =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => resolve())
      )
    );

  const sleep = (ms: number) =>
    new Promise<void>((resolve) => window.setTimeout(resolve, ms));

  const captureCanvas = () => {
    const canvas = document.querySelector(
      "canvas.canvas-3d, canvas"
    ) as HTMLCanvasElement | null;

    if (!canvas) return null;

    const maxWidth = 1280;
    const scale = Math.min(1, maxWidth / canvas.width);
    const targetWidth = Math.max(1, Math.floor(canvas.width * scale));
    const targetHeight = Math.max(1, Math.floor(canvas.height * scale));

    const out = document.createElement("canvas");
    out.width = targetWidth;
    out.height = targetHeight;
    const ctx = out.getContext("2d");
    if (!ctx) return null;

    try {
      ctx.drawImage(canvas, 0, 0, targetWidth, targetHeight);
      return out.toDataURL("image/jpeg", 0.82);
    } catch {
      try {
        return canvas.toDataURL("image/jpeg", 0.82);
      } catch {
        return null;
      }
    }
  };

  // Always capture from right-side view
  const captureForPlaceOrder = async () => {
    const currentView = stateManager.designManager.cameraView;

    // Switch to right-chair camera before place-order navigation.
    stateManager.designManager.setCameraView("rightChairView");

    // Wait for camera interpolation + a couple of frames.
    await sleep(950);
    await waitForNextPaint();
    await waitForNextPaint();

    let capture = captureCanvas();
    if (!capture) {
      await waitForNextPaint();
      capture = captureCanvas();
    }

    const fallbackCapture = localStorage.getItem("bemade:lastCapture");
    const finalCapture = capture || fallbackCapture;

    try {
      if (finalCapture) {
        localStorage.setItem(PLACE_ORDER_CAPTURE_KEY, finalCapture);
        localStorage.setItem(
          PLACE_ORDER_CAPTURE_EXPIRY_KEY,
          String(Date.now() + PLACE_ORDER_CAPTURE_TTL_MS)
        );
      } else {
        localStorage.removeItem(PLACE_ORDER_CAPTURE_KEY);
        localStorage.removeItem(PLACE_ORDER_CAPTURE_EXPIRY_KEY);
      }
    } catch {
      localStorage.removeItem(PLACE_ORDER_CAPTURE_KEY);
      localStorage.removeItem(PLACE_ORDER_CAPTURE_EXPIRY_KEY);
    }

    // Restore previous view
    stateManager.designManager.setCameraView(currentView);
  };

  const persistOrderSnapshot = () => {
    const orderSnapshot = {
      tableTexture: tableTexture || "-",
      baseShape: baseShape || "-",
      baseColor: baseColor || "-",
      topLength,
      topWidth,
      tableTop: tableTop || "-",
      chairType: chairType || "-",
      chairColor: chairColor || "-",
      chairQuantity,
      tablePrice,
      chairPrice,
      totalPrice,
    };

    localStorage.setItem(
      "bemade:lastOrderSnapshot",
      JSON.stringify(orderSnapshot)
    );
  };

  const handlePlaceOrder = async () => {
    localStorage.removeItem(SAMPLE_ORDER_KEY);
    persistOrderSnapshot();
    await captureForPlaceOrder();
    navigate("/place-order");
  };

  return (
    <div className="w-full p-5 mx-auto font-sans text-gray-800 pb-20">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold">BeMade™</h1>
        <p className="text-xs tracking-widest text-gray-500 mt-1">
          YOUR DESIGN &nbsp; | &nbsp; OUR PERFECTION
        </p>
      </div>

      {/* Section Title */}
      <h2 data-nav-anchor className="text-lg font-medium mb-3">
        YOUR BUILD
      </h2>

      {/* Build Details */}
      <div className="divide-y divide-gray-200 text-[15px]">
        <div className="flex justify-between py-3">
          <span>Table Top</span>
          <span className="text-gray-600">
            {tableTexture || "-"}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Base</span>
          <span className="text-gray-600">
            {baseShape || "-"}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Base Colour</span>
          <span className="text-gray-600">
            {baseColor || "-"}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Dimensions</span>
          <span className="text-gray-600">
            Length: {topLength} mm × Width: {topWidth} mm
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Table Top Shape</span>
          <span className="text-gray-600">
            {tableTop || "-"}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Chair Type</span>
          <span className="text-gray-600">
            {chairType || "-"}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Chair Colour</span>
          <span className="text-gray-600">
            {chairColor || "-"}
          </span>
        </div>

        <div className="flex justify-between py-3">
          <span>Chair Quantity</span>
          <span className="text-gray-600">
            {chairQuantity}
          </span>
        </div>
      </div>

      {/* Price Box */}
      <div className="mt-6 bg-gray-100 rounded-xl p-4 text-[15px]">
        <div className="flex justify-between py-2">
          <span>Dining Table</span>
          <span>€{tablePrice}</span>
        </div>

        <div className="flex justify-between py-2 border-b border-gray-300 pb-3">
          <span>Chairs</span>
          <span>€{chairPrice}</span>
        </div>

        <div className="flex justify-between pt-3 font-medium text-lg">
          <span>Total</span>
          <span>€{totalPrice}</span>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="mt-6 bg-gray-200 rounded-2xl p-5 text-sm text-gray-700 leading-relaxed">
        <p className="font-semibold text-gray-800 mb-2">
          Estimated Delivery:
        </p>

        <p className="mb-2">
          Our products are all unique, made to order and this takes
          some time in our factory.
        </p>

        <p>
          Once your order has been made, we will notify and arrange
          delivery with you. Currently the estimated delivery times
          are within{" "}
          <span className="font-semibold">14–21 days.</span>
        </p>
      </div>

      {/* Place Order Button */}
      <button
        onClick={handlePlaceOrder}
        className="mt-6 w-full bg-black text-white py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-900 transition"
      >
        PLACE ORDER
      </button>
    </div>
  );
});
