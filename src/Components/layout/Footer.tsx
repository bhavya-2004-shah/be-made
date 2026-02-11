import { observer } from "mobx-react-lite";
import { useMainContext } from "../../hooks/useMainContext";

export const Footer = observer(() => {
  const stateManager = useMainContext();
  const design = stateManager.designManager;

  const topTexture = design.tableTextureManager.selectedTextureData?.name || "-";
  const baseShape = design.baseShapeManager.selectedBaseShape?.name || "-";
  const baseColor = design.baseColorManager.selectedBaseColor?.name || "-";
  const topShape = design.tableTopManager.selectedTableTop || "-";
  const chairType = design.chairManager.selectedChair?.name || "-";
  const chairColor = design.chairColorManager.selectedChairColor?.name || "-";

  const dimensions = `${design.dimensionManager.topLength} x ${design.dimensionManager.topWidth}`;


  const items = [
    { label: "Your Build", value: "Dining Table" },
    { label: "Table Top", value: topTexture },
    { label: "Table Base", value: baseShape },
    { label: "Table Base Colour", value: baseColor },
    { label: "Dimensions (mm)", value: dimensions },
    { label: "Table Top Shape", value: topShape },
    { label: "Chair Style", value: chairType },
    { label: "Chair Color", value: chairColor },
  ];

  return (
    <div className="w-full border-t bg-white px-8 py-3">
      <div className="flex flex-nowrap items-start gap-14 overflow-x-auto whitespace-nowrap">
        {items.map((item) => (
          <div key={item.label} className="w-full">
            <div className="text-[10px] text-gray-500">{item.label}</div>
            <div className="text-[15px] font-medium text-black">{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
});
