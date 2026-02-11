export const Light = () => {
  return (
    <>
      {/* Ambient light */}
      <ambientLight intensity={0.35} />

      {/* Main shadow light */}
      <directionalLight
        position={[1.5, 6, 3.5]}
        intensity={1.35}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.00025}
        shadow-normalBias={0.02}
      />

      {/* Front fill light */}
      <directionalLight
        position={[0, 2, 5]}
        intensity={0.5}
      />

  

      {/* Target that the spotlight will look at */}
      <object3D position={[0, 0, 0]} />
    </>
  );
};
