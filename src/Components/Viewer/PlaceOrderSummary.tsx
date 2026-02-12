import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMainContext } from "../../hooks/useMainContext";

type SampleOrderItem = {
  id: string;
  name: string;
  image: string;
  description: string;
};

type SampleOrderPayload = {
  items: SampleOrderItem[];
  quantity: number;
  totalPrice: number;
  createdAt: number;
};

export const PlaceOrderSummary = observer(() => {
  const PLACE_ORDER_CAPTURE_KEY = "bemade:placeOrderRightChairCapture";
  const PLACE_ORDER_CAPTURE_EXPIRY_KEY =
    "bemade:placeOrderRightChairCaptureExpiresAt";
  const SAMPLE_ORDER_KEY = "bemade:sampleOrder";

  const navigate = useNavigate();
  const stateManager = useMainContext();
  const design = stateManager.designManager;

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [snapshot, setSnapshot] = useState<{
    tableTexture: string;
    baseShape: string;
    baseColor: string;
    topLength: number;
    topWidth: number;
    tableTop: string;
    chairType: string;
    chairColor: string;
    chairQuantity: number;
    tablePrice: number;
    chairPrice: number;
    totalPrice: number;
  } | null>(null);
  const [sampleOrder, setSampleOrder] = useState<SampleOrderPayload | null>(null);

  useEffect(() => {
    const rawSampleOrder = localStorage.getItem(SAMPLE_ORDER_KEY);
    if (rawSampleOrder) {
      try {
        const parsed = JSON.parse(rawSampleOrder) as SampleOrderPayload;
        if (Array.isArray(parsed.items) && parsed.items.length > 0) {
          setSampleOrder(parsed);
          setPreviewImage(null);
          return;
        }
      } catch {
        setSampleOrder(null);
      }
    }

    const rawSnapshot = localStorage.getItem("bemade:lastOrderSnapshot");
    if (rawSnapshot) {
      try {
        setSnapshot(JSON.parse(rawSnapshot));
      } catch {
        setSnapshot(null);
      }
    }

    const capture =
      localStorage.getItem(PLACE_ORDER_CAPTURE_KEY) ||
      localStorage.getItem("bemade:lastCapture");
    const expiryRaw = localStorage.getItem(
      PLACE_ORDER_CAPTURE_EXPIRY_KEY
    );
    const expiry = expiryRaw ? Number(expiryRaw) : 0;
    const isValid = !!capture && Number.isFinite(expiry) && Date.now() < expiry;

    if (isValid) {
      setPreviewImage(capture);
    } else {
      setPreviewImage(null);
      localStorage.removeItem(PLACE_ORDER_CAPTURE_KEY);
      localStorage.removeItem(PLACE_ORDER_CAPTURE_EXPIRY_KEY);
    }
  }, []);

  const tableTexture =
    snapshot?.tableTexture ||
    design.tableTextureManager.selectedTextureData?.name ||
    "-";
  const baseShape =
    snapshot?.baseShape ||
    design.baseShapeManager.selectedBaseShape?.name ||
    "-";
  const baseColor =
    snapshot?.baseColor ||
    design.baseColorManager.selectedBaseColor?.name ||
    "-";
  const topLength = snapshot?.topLength ?? design.dimensionManager.topLength;
  const topWidth = snapshot?.topWidth ?? design.dimensionManager.topWidth;
  const tableTop =
    snapshot?.tableTop ||
    design.tableTopManager.selectedTableTop ||
    "-";
  const chairType =
    snapshot?.chairType ||
    design.chairManager.selectedChair?.name ||
    "-";
  const chairColor =
    snapshot?.chairColor ||
    design.chairColorManager.selectedChairColor?.name ||
    "-";
  const chairQuantity =
    snapshot?.chairQuantity ?? design.chairCountManager.count;

  const sampleNames = sampleOrder?.items.map((item) => item.name).join(", ") || "-";

  const summaryRows = sampleOrder
    ? [
        { label: "Order Type", value: "Texture Samples" },
        { label: "Selected Textures", value: sampleNames },
        { label: "Texture Quantity", value: String(sampleOrder.quantity) },
        { label: "Sample Total", value: `GBP ${sampleOrder.totalPrice}` },
      ]
    : [
        { label: "Table Top", value: tableTexture },
        { label: "Base", value: baseShape },
        { label: "Base Colour", value: baseColor },
        {
          label: "Dimensions",
          value: `Length: ${topLength} mm x Width: ${topWidth} mm`,
        },
        { label: "Table Top Shape", value: tableTop },
        { label: "Chair Type", value: chairType },
        { label: "Chair Colour", value: chairColor },
        { label: "Chair Quantity", value: String(chairQuantity) },
      ];

  const inputClassName =
    "h-10 w-full rounded-md border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none placeholder:text-gray-400 focus:border-gray-400";

  return (
    <div className="min-h-screen bg-[#f4f4f4] text-gray-800">
      <header className="h-16 border-b bg-white px-6 shadow-sm">
        <div className="mx-auto flex h-full max-w-[1360px] items-center">
          <h1 className="text-5xl font-light tracking-tight">
            bemade<span className="align-top text-xs">TM</span>
          </h1>
        </div>
      </header>

      <main className="mx-auto grid max-w-[1360px] grid-cols-1 gap-10 px-6 py-8 lg:grid-cols-[1.55fr_1fr]">
        <section className="rounded-xl bg-transparent p-2">
          <h2 className="mb-8 text-5xl font-semibold text-black">Checkout</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input className={inputClassName} placeholder="Enter full name" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Address Line 1 <span className="text-red-500">*</span>
              </label>
              <input className={inputClassName} placeholder="Enter address line 1" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Address Line 2
              </label>
              <input
                className={inputClassName}
                placeholder="Enter address line 2 (optional)"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                City <span className="text-red-500">*</span>
              </label>
              <input className={inputClassName} placeholder="Enter city" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Postcode <span className="text-red-500">*</span>
              </label>
              <input className={inputClassName} placeholder="Enter postcode" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                County
              </label>
              <input className={inputClassName} placeholder="Enter county" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input className={inputClassName} placeholder="Enter phone number" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-600">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input className={inputClassName} placeholder="Enter email address" />
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={() => navigate("/")}
              className="rounded-full border border-gray-300 bg-white px-6 py-2 text-sm text-gray-700 hover:bg-gray-50"
            >
              {"<"} Back to Design
            </button>

            <button
              type="button"
              className="rounded-full bg-gray-800 px-7 py-2 text-sm font-semibold text-white"
            >
              Terms & Conditions
            </button>

            <button
              type="button"
              className="rounded-full bg-gray-300 px-8 py-2 text-sm font-semibold text-white"
            >
              Pay Now {">"}
            </button>
          </div>

          <div className="mt-10 max-w-[760px] rounded-lg">
            <p className="text-xs leading-6 text-gray-700">
              <span className="mr-3 rounded bg-gray-700 px-1.5 py-0.5 text-[11px] font-semibold text-white">
                i
              </span>
              <span className="mr-2 font-bold uppercase text-black">Important</span>
              Due to the bespoke nature of your order, we can only provide 48 hours
              after placing your order, where you may cancel or make any changes
              before production process begins. After this point, cancellations and
              amendments will not be possible.
            </p>
          </div>
        </section>

        <aside className="rounded-xl bg-[#ececec] p-6">
          {!sampleOrder && (
            <div className="mb-5 h-[260px] overflow-hidden rounded-lg bg-[#dddddd]">
              {previewImage ? (
                <img
                  src={previewImage}
                  alt="Final configured table and chairs"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center px-6 text-center text-sm text-gray-500">
                  Save the canvas image once from the viewer to show final table + chairs preview here.
                </div>
              )}
            </div>
          )}

          <div className="mb-4">
            <h3 className="text-5xl font-medium text-black">
              BeMade<span className="align-top text-xs">TM</span>
            </h3>
            <p className="mt-1 text-xs font-semibold tracking-[0.2em] text-gray-500">
              YOUR DESIGN | OUR PERFECTION
            </p>
          </div>

          <hr className="my-4 border-gray-300" />
          <h4 className="mb-3 text-3xl font-medium text-gray-700">
            {sampleOrder ? "SAMPLE DETAILS" : "YOUR BUILD"}
          </h4>

          <div className="text-sm">
            {summaryRows.map((row) => (
              <div
                key={row.label}
                className="flex items-center justify-between border-b border-gray-300 py-2"
              >
                <span className="text-gray-700">{row.label}</span>
                <span className="pl-4 text-right text-gray-600">{row.value}</span>
              </div>
            ))}
          </div>
        </aside>
      </main>
    </div>
  );
});
