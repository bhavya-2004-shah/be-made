import { useThree, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../../hooks/useMainContext";
import { CAMERA_VIEWS, type CameraViewType } from "./cameraConfig";

export const Camera = observer(() => {
  const { camera } = useThree();
  const state = useMainContext();

  const view: CameraViewType = state.designManager.cameraView || "rightSide";

  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const targetUp = useRef(new THREE.Vector3(0, 1, 0));
  const smoothLook = useRef(new THREE.Vector3());
  const isInitialized = useRef(false);

  useEffect(() => {
    const currentView = CAMERA_VIEWS[view];
    targetPos.current.copy(currentView.pos);
    targetLook.current.copy(currentView.look);
    targetUp.current.copy(currentView.up);

    if (!isInitialized.current) {
      camera.position.copy(currentView.pos);
      camera.up.copy(currentView.up);
      smoothLook.current.copy(currentView.look);
      camera.lookAt(currentView.look);
      isInitialized.current = true;
    }
  }, [camera, view]);

  useFrame(() => {
    camera.position.lerp(targetPos.current, 0.008);
    smoothLook.current.lerp(targetLook.current, 0.008);
    camera.up.lerp(targetUp.current, 0.008).normalize();
    camera.lookAt(smoothLook.current);
  });

  return null;
});
