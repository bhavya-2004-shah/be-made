import { Canvas } from "@react-three/fiber";
import { observer } from "mobx-react-lite";
import React, { Suspense, useRef } from "react";
import Loader from "../Loader/Loader";
import { CameraViewButtons } from "../Camera/CameraViewButtons";
import { CanvasActionButtons } from "./CanvasActionButtons";

const Canvas3D = observer(({ children }: { children: React.ReactNode }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      style={{ position: "relative", width: "100%", height: "100%" }}
    >
      <Canvas
        className="canvas-3d"
        shadows
        camera={{ fov: 50 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
      >
        <Suspense fallback={<Loader />}>{children}</Suspense>
      </Canvas>
      <CanvasActionButtons containerRef={containerRef} />
      <CameraViewButtons />
    </div>
  );
});

export default Canvas3D;
