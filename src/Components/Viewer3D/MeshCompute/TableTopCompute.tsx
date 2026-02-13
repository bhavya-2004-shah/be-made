import { useGLTF } from "@react-three/drei";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react-lite";
import type { TableTopColorJson } from "../../../types";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useManualTextureTransition } from "../../../utils/useTextureTransition";

export const TableTopCompute = observer(() => {
  const stateManager = useMainContext();
  const activeView = stateManager.designManager.cameraView;

  if (activeView === "twoChairView") return null;

  const meshManager = stateManager.design3DManager.meshManager;
  const dimensionManager = stateManager.designManager.dimensionManager;

  const topModelUrl = meshManager.topShapeModelUrl;
  const topMdfUrl = meshManager.topShapeMdfUrl;

  const topTextures = meshManager.selectedTexture;

  const topLength = dimensionManager.topLength;
  const topWidth = dimensionManager.topWidth;
  const maxLength = dimensionManager.maxLength;
  const maxWidth = dimensionManager.maxWidth;

  if (!topModelUrl || !topMdfUrl) return null;

  return (
    <>
      <Top
        url={topMdfUrl}
        topTexture={topTextures}
        topLength={topLength}
        topWidth={topWidth}
        maxLength={maxLength}
        maxWidth={maxWidth}
      />
      <Top
        url={topModelUrl}
        topTexture={topTextures}
        topLength={topLength}
        topWidth={topWidth}
        maxLength={maxLength}
        maxWidth={maxWidth}
      />
    </>
  );
});

interface TopProps {
  url: string;
  topTexture: TableTopColorJson | null;
  topLength: number;
  topWidth: number;
  maxLength: number;
  maxWidth: number;
}

function Top({
  url,
  topTexture,
  topLength,
  topWidth,
  maxLength,
  maxWidth,
}: TopProps) {
  const { scene } = useGLTF(url);

  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);

  const { textures } = useManualTextureTransition(topTexture);

  // scale logic
  const scale = useMemo(() => {
    const scaleX = topLength / maxLength;
    const scaleZ = topWidth / maxWidth;
    return [scaleX, 1, scaleZ];
  }, [topLength, topWidth, maxLength, maxWidth]);

  // cache materials once per scene
  useEffect(() => {
    const nextMaterials: THREE.MeshStandardMaterial[] = [];

    scene.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.castShadow = true;
        child.receiveShadow = true;

        const original = child.material;
        if (Array.isArray(original)) {
          const cloned = original.map((mat) =>
            mat instanceof THREE.MeshStandardMaterial ? mat.clone() : mat
          );
          child.material = cloned;
          for (const mat of cloned) {
            if (mat instanceof THREE.MeshStandardMaterial) {
              nextMaterials.push(mat);
            }
          }
        } else if (original instanceof THREE.MeshStandardMaterial) {
          const cloned = original.clone();
          child.material = cloned;
          nextMaterials.push(cloned);
        }
      }
    });

    materialsRef.current = nextMaterials;
  }, [scene]);

  // apply textures when ready, without hiding the mesh
  useEffect(() => {
    if (!textures) return;

    for (const material of materialsRef.current) {
      material.map = textures.map;
      material.normalMap = textures.normalMap;
      material.roughnessMap = textures.roughnessMap;
      material.metalnessMap = textures.metalnessMap;
      material.transparent = false;
      material.opacity = 1;
      material.needsUpdate = true;
    }
  }, [textures]);

  return <primitive object={scene} scale={scale} />;
}
