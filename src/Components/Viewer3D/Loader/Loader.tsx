import { Html } from "@react-three/drei";

const styleTag = `
@keyframes bm-spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@keyframes bm-pulse {
  0%, 100% { opacity: 0.6; transform: scale(1); }
  50% { opacity: 1; transform: scale(1.15); }
}

.bm-loader-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.bm-loader {
  position: relative;
  width: 56px;
  height: 56px;
}

.bm-loader-ring {
  position: absolute;
  inset: 0;
  border-radius: 50%;
  border: 4px solid rgba(0, 0, 0, 0.08);
  border-top-color: #111;
  animation: bm-spin 1s linear infinite;
}

.bm-loader-core {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 14px;
  height: 14px;
  background: #111;
  border-radius: 50%;
  transform: translate(-50%, -50%);
  animation: bm-pulse 1.2s ease-in-out infinite;
}
`;

const Loader = () => {
  return (
    <Html center>
      <style>{styleTag}</style>
      <div className="bm-loader-wrapper">
        <div className="bm-loader">
          <div className="bm-loader-ring" />
          <div className="bm-loader-core" />
        </div>
      </div>
    </Html>
  );
};

export default Loader;
