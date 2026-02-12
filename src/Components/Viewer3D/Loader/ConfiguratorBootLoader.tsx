type ConfiguratorBootLoaderProps = {
  progress: number;
};

export const ConfiguratorBootLoader = ({
  progress,
}: ConfiguratorBootLoaderProps) => {
  const safeProgress = Math.max(0, Math.min(100, progress));

  return (
    <div className="fixed inset-0 z-[100] bg-black text-white flex items-center justify-center">
      <div className="w-[min(520px,92vw)] px-6">
        <p className="text-xl md:text-2xl font-medium tracking-wide">
          Loading 3D configurator...
        </p>

        <div className="mt-5 h-1.5 w-full rounded-full bg-white/20 overflow-hidden">
          <div
            className="h-full bg-white transition-[width] duration-300 ease-out"
            style={{ width: `${safeProgress}%` }}
          />
        </div>
      </div>
    </div>
  );
};
