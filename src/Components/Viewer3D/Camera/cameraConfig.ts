import * as THREE from "three";

export type CameraViewType =
  | "rightSide"
  | "top"
  | "front"
  | "leftSide"
  | "twoChairView"
  | "rightChairView"
  | "topChairView";

export const CAMERA_VIEWS: Record<
  CameraViewType,
  { pos: THREE.Vector3; look: THREE.Vector3; up: THREE.Vector3 }
> = {
  rightSide: {
    pos: new THREE.Vector3(4, 1.5,2),
    look: new THREE.Vector3(0, -0, 0),
    up: new THREE.Vector3(0, 1, 0),
  },
  top: {
    pos: new THREE.Vector3(0, 5, 0),
    look: new THREE.Vector3(0, 0, 0),
    up: new THREE.Vector3(0, 0, -1),
  },
  front: {
   pos: new THREE.Vector3(0, 0.85, 3),
  look: new THREE.Vector3(0, 0.3, 0),
  up: new THREE.Vector3(0, 5, 0),
  },
  leftSide: {
     pos: new THREE.Vector3(-2.5, 1, 1),
    look: new THREE.Vector3(0, 0.6, 0),
    up: new THREE.Vector3(0, 0.6, 0),
  },
  twoChairView: {
    pos: new THREE.Vector3(0, 1, 2),
    look: new THREE.Vector3(0, 0.3, 0),
    up: new THREE.Vector3(0, 1, 0),
  },
  rightChairView: {
    pos: new THREE.Vector3(4, 1.5, 2),
    look: new THREE.Vector3(0, 0, 0),
    up: new THREE.Vector3(0, 1, 0),
  },
  topChairView: {
    pos: new THREE.Vector3(0, 5, 0),
    look: new THREE.Vector3(0, 0, 0),
    up: new THREE.Vector3(0, 0, -1),
  },
};
