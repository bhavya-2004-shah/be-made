import { Clone, useGLTF, useTexture } from "@react-three/drei";
import { observer } from "mobx-react-lite";
import { useMemo } from "react";
import * as THREE from "three";
import { useMainContext } from "../../../hooks/useMainContext";
import { computeChairLayoutByShape } from "../../../utils/ChairLayout";
import type { CameraViewType } from "../Camera/cameraConfig";

type ChairTransform = {
  position: [number, number, number];
  rotation: [number, number, number];
};

const CHAIR_ENABLED_VIEWS: CameraViewType[] = [
  "twoChairView",
  "rightChairView",
  "topChairView",
];

type ChairRendererProps = {
  chairUrl: string;
  selectedChairColor: any;
  layout: ChairTransform[];
};

const ChairRenderer = ({ chairUrl, selectedChairColor, layout }: ChairRendererProps) => {
  const { scene } = useGLTF(chairUrl);

  const textures = useTexture({
    topMap: selectedChairColor.chairTopColor,
    topMetalness: selectedChairColor.chairTopMetalness,
    topNormal: selectedChairColor.chairTopNormal,
    topRoughness: selectedChairColor.chairTopRoughness,
    legMap: selectedChairColor.chairLegColor,
    legMetalness: selectedChairColor.chairLegMetalness,
    legNormal: selectedChairColor.chairLegNormal,
    legRoughness: selectedChairColor.chairLegRoughness,
  });

  textures.topMap.colorSpace = THREE.SRGBColorSpace;
  textures.legMap.colorSpace = THREE.SRGBColorSpace;

  const texturedScene = useMemo(() => {
    const cloned = scene.clone(true);

    cloned.traverse((child: any) => {
      if (!child.isMesh) return;

      child.castShadow = true;
      child.receiveShadow = true;

      if (child.name === "Top") {
        child.material = new THREE.MeshStandardMaterial({
          map: textures.topMap,
          normalMap: textures.topNormal,
          roughnessMap: textures.topRoughness,
          metalnessMap: textures.topMetalness,
        });
      }

      if (child.name === "Leg") {
        child.material = new THREE.MeshStandardMaterial({
          map: textures.legMap,
          normalMap: textures.legNormal,
          roughnessMap: textures.legRoughness,
          metalnessMap: textures.legMetalness,
        });
      }
    });

    return cloned;
  }, [scene, textures]);

  if (!texturedScene || layout.length === 0) return null;

  return (
    <>
      {layout.map((chair, index) => (
        <Clone
          key={index}
          object={texturedScene}
          position={chair.position}
          rotation={chair.rotation}
        />
      ))}
    </>
  );
};

export const ChairCompute = observer(() => {
  const stateManager = useMainContext();

  const activeView = stateManager.designManager.cameraView;
  const chairCount = stateManager.designManager.chairCountManager.count;
  const chairUrl = stateManager.design3DManager.meshManager.chairShapeModelUrl;
  const selectedChairColor =
    stateManager.designManager.chairColorManager.selectedChairColor;
  const shape = stateManager.designManager.tableTopManager.selectedTableTop;

  if (
    !CHAIR_ENABLED_VIEWS.includes(activeView) ||
    chairCount <= 0 ||
    !chairUrl ||
    !selectedChairColor
  ) {
    return null;
  }

  let layout: ChairTransform[] = [];

  if (activeView === "twoChairView") {
    layout = [
      {
        position: [-0.3, 0, 0],
        rotation: [0, Math.PI, 0],
      },
      {
        position: [0.3, 0, 0],
        rotation: [0, 0, 0],
      },
    ];
  } else {
    if (!shape) return null;

    const tableWidth = stateManager.designManager.dimensionManager.topLength / 1000;
    const tableLength = stateManager.designManager.dimensionManager.topWidth / 1000;

    layout =
      computeChairLayoutByShape(shape, chairCount, tableWidth, tableLength) || [];
  }

  return (
    <ChairRenderer
      chairUrl={chairUrl}
      selectedChairColor={selectedChairColor}
      layout={layout}
    />
  );
});
