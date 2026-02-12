import * as THREE from "three";
import { useThree, useLoader } from "@react-three/fiber";
import { Environment as DreiEnvironment } from "@react-three/drei";
import { useEffect } from "react";

function Environment() {
  const { scene } = useThree();

  // background texture
  const texture = useLoader(
    THREE.TextureLoader,
    "/assets/images/background/background.svg"
  );

  texture.colorSpace = THREE.SRGBColorSpace;

  useEffect(() => {
    scene.background = texture;
    return () => {
      if (scene.background === texture) {
        scene.background = null;
      }
    };
  }, [scene, texture]);

  return (
    <>
      {/* HDR lighting preset */}
      <DreiEnvironment preset="studio"  environmentIntensity={0.2}/>
    </>
  );
}

export default Environment;
