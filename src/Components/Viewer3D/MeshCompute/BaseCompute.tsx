import { observer } from "mobx-react-lite";
import { useMainContext } from "../../../hooks/useMainContext";
import { useGLTF, useTexture } from "@react-three/drei";
import { useEffect } from "react";
import * as THREE from "three";


export const BaseCompute = observer(() => {
  const stateManager = useMainContext();
  const activeView = stateManager.designManager.cameraView;

  if (activeView === "twoChairView") return null;

  const meshManager = stateManager.design3DManager.meshManager;
  const baseColorManager = stateManager.designManager.baseColorManager;
  const dimensionManager = stateManager.designManager.dimensionManager;

  const modelUrl = meshManager.baseShapeModelUrl;
  const selectedColor = baseColorManager.selectedBaseColor;

  const baseShape =
    stateManager.designManager.baseShapeManager.selectedBaseShape?.name;

  const tableLength = dimensionManager.topLength;
  const maxLength = dimensionManager.maxLength;

  if (!modelUrl) return null;

  return (
    <Model
      url={modelUrl}
      color={selectedColor}
      baseShape={baseShape}
      tableLength={tableLength}
      maxLength={maxLength}
    />
  );
});

interface ModelProps {
  url: string;
  color: any;
  tableLength: number;
  maxLength: number;
  baseShape: string;
}

function Model({ url, baseShape, color, tableLength, maxLength }: ModelProps) {
  
  let finalUrl = url;
  let isSmall = false;


  if (baseShape === "cradle") {
    const triggerLength = 2500;
    isSmall = tableLength < triggerLength;

    if (isSmall) {
    finalUrl = "/assets/images/base-shape/cradle/smallModel.glb";

    }
  }
 
  const { scene } = useGLTF(finalUrl);

  let ratio = tableLength / maxLength;

  let textures: any = null;

  if (color) {
    textures = useTexture({
      map: color.baseColor,
      normalMap: color.normal,
      roughnessMap: color.roughness,
      metalnessMap: color.metalness,

    });
   

    textures.map.colorSpace = THREE.SRGBColorSpace;
    textures.map.anisotropy = 16;
    textures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
    textures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    textures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;
    textures.color = color === "gold" || color=== "brass" ? new THREE.Color(0xff0000) : new THREE.Color(0x00ff00)
  }

  useEffect(() => {
    // apply textures
    if (color && textures) {
      scene.traverse((child: any) => {
        if (child.isMesh && child.material) {
          child.material = child.material.clone();
          child.castShadow = true
        child.receiveShadow = true
          child.material.map = textures.map;
          child.material.normalMap = textures.normalMap;
          child.material.roughnessMap = textures.roughnessMap;
          child.material.metalnessMap = textures.metalnessMap;
          
            child.material.metalness = color.metalnessValue ?? 0.6;
        child.material.roughness = color.roughnessValue ?? 0.4;
        console.log(color)

        child.material.color = color.name === "Gold" || color.name === "Brass Break" ? new THREE.Color('#f5e8d0') : new THREE.Color('#ffffff')
        
          child.material.needsUpdate = true;
        }
      });
    }

    // move legs only for big model 
    if (!isSmall) {
      scene.children.forEach((child: any) => {
        if (!child.userData.originalPosition) {
          child.userData.originalPosition = child.position.clone();
        }

        const original = child.userData.originalPosition;
        if(baseShape === "moon") {
         if(tableLength < 2900)
         {
           ratio = 0.8
         }else{
          ratio = 1
         }
        }
        child.position.x = original.x * ratio;
        child.position.z = original.z * ratio;
      });
    }
  }, [scene, textures, color, ratio, isSmall]); 

  return <primitive object={scene} />;
}