import { BaseCompute } from "./MeshCompute/BaseCompute.tsx";
import { Camera } from "./Camera/Camera.tsx";
import { TableTopCompute } from "./MeshCompute/TableTopCompute.tsx";
import { ChairCompute } from "./MeshCompute/ChairCompute.tsx";
import Environment from "./Environment/Environment.tsx";
import Canvas3D from "./Canvas3D/Canvas3D.tsx";
import Loader from "./Loader/Loader.tsx";
import { Suspense } from "react";
import { OrbitControls } from "@react-three/drei";
import { Light } from "./Light/Light.tsx";

export const Viewer3D = () => {
  return (
    <Canvas3D>
      <Suspense fallback={<Loader />}>
        <Environment />
      </Suspense>

      <Light />

      {/* Models */}
      <Suspense fallback={<Loader />}>
        <BaseCompute />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <TableTopCompute />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <ChairCompute />
      </Suspense>

      <Suspense fallback={<Loader />}>
        <Camera />
      </Suspense>

      {/* <ContactShadows
        position={[0, -0.02, 0]}
        opacity={0.2}
        scale={12}
        blur={1.25}
        far={4}
        resolution={1024}
      /> */}

      {/* Shadow receiving plane */}
      <mesh
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.03, 0]}
        receiveShadow={true}
      >
        <planeGeometry args={[14, 14]} />
        <shadowMaterial opacity={0.12} />
      </mesh>

      <OrbitControls
        makeDefault
       
      />
    </Canvas3D>
  );
};
