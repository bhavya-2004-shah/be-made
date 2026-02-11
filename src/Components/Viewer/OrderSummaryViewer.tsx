import { observer } from "mobx-react-lite";
import {useNavigate} from "react-router-dom"

import { useMainContext } from "../../hooks/useMainContext";

export const OrderSummaryViewer = observer(() => {
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

    const tablePrice = stateManager.designManager.pricingManager.tablePrice;
const chairPrice = stateManager.designManager.pricingManager.chairPrice;
const totalPrice =stateManager.designManager.pricingManager.totalPrice;

console.log(tablePrice)

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
      <h2 className="text-lg font-medium mb-3">YOUR BUILD</h2>

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
    Our products are all unique, made to order and this takes some
    time in our factory.
  </p>

  <p>
    Once your order has been made, we will notify and arrange
    delivery with you. Currently the estimated delivery times are
    within <span className="font-semibold">14–21 days.</span>
  </p>
</div>

{/* Place Order Button */}
<button
  onClick={() => navigate("/place-order")}
  className="mt-6 w-full bg-black text-white py-4 rounded-full text-sm font-semibold tracking-wide hover:bg-gray-900 transition"
>
  PLACE ORDER
</button>


    </div>
  );
});
