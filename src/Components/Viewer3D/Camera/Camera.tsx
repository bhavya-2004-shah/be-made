import { useFrame, useThree } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { observer } from "mobx-react-lite";
import { useMainContext } from "../../../hooks/useMainContext";
import { CAMERA_VIEWS, type CameraViewType } from "./cameraConfig";

type OrbitControlsLike = {
  target: THREE.Vector3;
  update: () => void;
};

export const Camera = observer(() => {
  const state = useMainContext();

  const { camera, controls: rawControls } = useThree();
  const controls = rawControls as unknown as OrbitControlsLike | undefined;

  const view: CameraViewType =
    state.designManager.cameraView || "front";


  const isInitializedRef = useRef(false);
  const lastViewRef = useRef<CameraViewType | null>(null);
  const isAnimatingRef = useRef(false);
  const transitionTimeRef = useRef(0);
  const transitionDurationRef = useRef(0.85);

  const fromPosRef = useRef(new THREE.Vector3());
  const toPosRef = useRef(new THREE.Vector3());
  const fromLookRef = useRef(new THREE.Vector3());
  const toLookRef = useRef(new THREE.Vector3());
  const fromUpRef = useRef(new THREE.Vector3(0, 1, 0));
  const toUpRef = useRef(new THREE.Vector3(0, 1, 0));
  const smoothLookRef = useRef(new THREE.Vector3());

  useEffect(() => {
    const currentView = CAMERA_VIEWS[view];
    const nextUp = currentView.up.clone().normalize();

    if (!isInitializedRef.current) {
      camera.position.copy(currentView.pos);
      camera.up.copy(nextUp);
      smoothLookRef.current.copy(currentView.look);
      camera.lookAt(currentView.look);
      controls?.target.copy(currentView.look);
      controls?.update();

      isInitializedRef.current = true;
      lastViewRef.current = view;
      isAnimatingRef.current = false;
      return;
    }

    if (lastViewRef.current === view) {
      return;
    }

    fromPosRef.current.copy(camera.position);
    toPosRef.current.copy(currentView.pos);

    fromLookRef.current.copy(smoothLookRef.current);
    toLookRef.current.copy(currentView.look);

    fromUpRef.current.copy(camera.up).normalize();
    toUpRef.current.copy(nextUp);

    transitionTimeRef.current = 0;
    transitionDurationRef.current = view === "top" ? 0.95 : 0.85;
    isAnimatingRef.current = true;
    lastViewRef.current = view;
  }, [camera, controls, view]);

  useEffect(() => {
    if (!controls || !isInitializedRef.current) return;
    controls.target.copy(smoothLookRef.current);
    controls.update();
  }, [controls]);

  useFrame((_, delta) => {
    if (!isAnimatingRef.current) return;

    transitionTimeRef.current += delta;
    const t = THREE.MathUtils.clamp(
      transitionTimeRef.current / transitionDurationRef.current,
      0,
      1
    );
    const eased = t * t * (3 - 2 * t);

    camera.position.lerpVectors(fromPosRef.current, toPosRef.current, eased);
    smoothLookRef.current.lerpVectors(
      fromLookRef.current,
      toLookRef.current,
      eased
    );
    camera.up.lerpVectors(fromUpRef.current, toUpRef.current, eased).normalize();
    camera.lookAt(smoothLookRef.current);

    controls?.target.copy(smoothLookRef.current);
    controls?.update();

    if (t >= 1) {
      camera.position.copy(toPosRef.current);
      smoothLookRef.current.copy(toLookRef.current);
      camera.up.copy(toUpRef.current);
      camera.lookAt(smoothLookRef.current);
      controls?.target.copy(smoothLookRef.current);
      controls?.update();
      isAnimatingRef.current = false;
    }
  });

  return null;
});
