import { useGLTF, useTexture } from "@react-three/drei";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react-lite";
import type { TableTopColorJson } from "../../../types";
import { useEffect, useMemo } from "react";
import * as THREE from "three";



export const TableTopCompute = observer(() => {
  const stateManager = useMainContext();
  const activeView = stateManager.designManager.cameraView;

  if (activeView === "twoChairView") return null;

  const meshManager = stateManager.design3DManager.meshManager;
  const dimensionManager = stateManager.designManager.dimensionManager;

  const topModelUrl = meshManager.topShapeModelUrl;
  const topMdfUrl = meshManager.topShapeMdfUrl;

  const topTextures = meshManager.selectedTexture

  const topLength = dimensionManager.topLength
  const topWidth = dimensionManager.topWidth
  const maxLength = dimensionManager.maxLength
  const maxWidth = dimensionManager.maxWidth
  

  console.log("hwhehhehehehheehehh",topTextures)

  if (!topModelUrl || !topMdfUrl) return null;

  return (
    <>
      <Top url={topMdfUrl}
       topTexture={topTextures}
       topLength={topLength}
       topWidth={topWidth}
       maxLength={maxLength}
       maxWidth={maxWidth}/>
      <Top url={topModelUrl}  topTexture={topTextures}  topLength={topLength}
       topWidth={topWidth}
       maxLength={maxLength}
       maxWidth={maxWidth}/>
    </>
  );
});

interface TopProps {
  url: string;
  topTexture : TableTopColorJson | null
  topLength : number 
  topWidth : number
  maxLength : number 
  maxWidth : number
}

function Top({ url , topTexture , topLength , topWidth , maxLength , maxWidth}: TopProps) {
  const { scene } = useGLTF(url);

  const scale = useMemo(() => {
    const scaleX = topLength / maxLength ; 
    const scaleZ = topWidth / maxWidth;

    return [scaleX , 1 , scaleZ]
  },
    [topLength , topWidth , maxLength , maxWidth]
)

  if(!topTexture) return <primitive object={scene} scale={scale} />;

  const textures = useTexture({
    map:topTexture.baseUrl,
    normalMap : topTexture.normalUrl,
    roughnessMap : topTexture.roughnessUrl,
    metalnessMap : topTexture.metalnessUrl
  });

  textures.map.colorSpace = THREE.SRGBColorSpace;
  textures.map.anisotropy = 16;
  textures.normalMap.colorSpace = THREE.LinearSRGBColorSpace;
  textures.roughnessMap.colorSpace = THREE.LinearSRGBColorSpace;
  textures.metalnessMap.colorSpace = THREE.LinearSRGBColorSpace;

  // Keep texture texel density stable as dimensions shrink by cropping
  // around center (instead of scaling texture details).
  const repeatX = THREE.MathUtils.clamp(topLength / maxLength, 0.001, 1);
  const repeatY = THREE.MathUtils.clamp(topWidth / maxWidth, 0.001, 1);
  const offsetX = (1 - repeatX) * 0.5;
  const offsetY = (1 - repeatY) * 0.5;

  Object.values(textures).forEach((texture) => {
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    texture.center.set(-0.3 , 0.3)
    texture.repeat.set(repeatX, repeatY);
    texture.offset.set(offsetX, offsetY);
    texture.needsUpdate = true;
  });

  useEffect(() => {
    scene.traverse((child :any) => {
      if(child.isMesh && child.material){
        child.castShadow = true
        

        child.material = child.material.clone();

        
        child.material.map = textures.map;
        child.material.normalMap = textures.normalMap;
        child.material.roughnessMap = textures.roughnessMap;
        child.material.metalnessMap = textures.metalnessMap;
       
         child.material.needsUpdate = true;
      }
    })
  },[scene , textures]);

  return <primitive object={scene} scale={scale} />;
}
