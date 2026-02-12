import { useGLTF, useTexture } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useMainContext } from "../../../hooks/useMainContext";
import { observer } from "mobx-react-lite";
import type { TableTopColorJson } from "../../../types";
import { useEffect, useMemo, useRef } from "react";
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
  const materialsRef = useRef<THREE.MeshStandardMaterial[]>([]);
  const currentRepeatRef = useRef(new THREE.Vector2(1, 1));
  const targetRepeatRef = useRef(new THREE.Vector2(1, 1));
  const currentOffsetRef = useRef(new THREE.Vector2(0, 0));
  const targetOffsetRef = useRef(new THREE.Vector2(0, 0));
  const fadeRef = useRef(1);
  const initializedRef = useRef(false);
  const textureIdRef = useRef<string | null>(null);
  const isAnimatingRef = useRef(false);

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

  useEffect(() => {
    targetRepeatRef.current.set(repeatX, repeatY);
    targetOffsetRef.current.set(offsetX, offsetY);
    isAnimatingRef.current = true;

    if (!initializedRef.current) {
      currentRepeatRef.current.copy(targetRepeatRef.current);
      currentOffsetRef.current.copy(targetOffsetRef.current);
      initializedRef.current = true;
    }
  }, [repeatX, repeatY, offsetX, offsetY]);

  useEffect(() => {
    if (textureIdRef.current && textureIdRef.current !== topTexture.id) {
      fadeRef.current = 0;
      isAnimatingRef.current = true;
    }
    textureIdRef.current = topTexture.id;
  }, [topTexture.id]);

  Object.values(textures).forEach((texture) => {
    texture.flipY = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
     texture.center.set(-0.3 , 0.3)
  });

  useEffect(() => {
    const nextMaterials: THREE.MeshStandardMaterial[] = [];

    scene.traverse((child :any) => {
      if(child.isMesh && child.material){
        child.castShadow = true;
        child.receiveShadow = true;

        child.material = child.material.clone();
        child.material.map = textures.map;
        child.material.normalMap = textures.normalMap;
        child.material.roughnessMap = textures.roughnessMap;
        child.material.metalnessMap = textures.metalnessMap;
        child.material.transparent = true;
        child.material.opacity = fadeRef.current;
        child.material.needsUpdate = true;

        nextMaterials.push(child.material);
      }
    });

    materialsRef.current = nextMaterials;
  }, [scene, textures]);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current) return;

    const cropSmoothing = 1 - Math.exp(-delta * 10);
    const fadeSmoothing = 1 - Math.exp(-delta * 6);

    currentRepeatRef.current.lerp(targetRepeatRef.current, cropSmoothing);
    currentOffsetRef.current.lerp(targetOffsetRef.current, cropSmoothing);

    Object.values(textures).forEach((texture) => {
      texture.repeat.copy(currentRepeatRef.current);
      texture.offset.copy(currentOffsetRef.current);
    });

    fadeRef.current = THREE.MathUtils.clamp(
      fadeRef.current + fadeSmoothing,
      0,
      1
    );

    for (const material of materialsRef.current) {
      material.opacity = fadeRef.current;
      material.transparent = fadeRef.current < 0.999;
    }

    const repeatDone =
      currentRepeatRef.current.distanceTo(targetRepeatRef.current) < 0.0001;
    const offsetDone =
      currentOffsetRef.current.distanceTo(targetOffsetRef.current) < 0.0001;
    const fadeDone = fadeRef.current > 0.999;

    if (repeatDone && offsetDone && fadeDone) {
      isAnimatingRef.current = false;
    }
  });

  return <primitive object={scene} scale={scale} />;
}
