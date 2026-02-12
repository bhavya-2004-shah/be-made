import { Navbar } from "../Components/layout/Navbar";
import { Footer } from "../Components/layout/Footer";
import { Viewer3D } from "../Components/Viewer3D/Viewer3D";
import { Viewer } from "../Components/Viewer";
import { useCallback, useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { useProgress } from "@react-three/drei";
import type { NavSectionKey } from "../Components/layout/Navbar";
import { useMainContext } from "../hooks/useMainContext";
import { ConfiguratorBootLoader } from "../Components/Viewer3D/Loader/ConfiguratorBootLoader";

export const MainLayout = observer(() => {
  const PLACE_ORDER_CAPTURE_KEY = "bemade:placeOrderRightChairCapture";
  const PLACE_ORDER_CAPTURE_EXPIRY_KEY =
    "bemade:placeOrderRightChairCaptureExpiresAt";

  const stateManager = useMainContext();
  const [showBootLoader, setShowBootLoader] = useState(true);
  const panelRef = useRef<HTMLDivElement>(null);
  const [activeSection, setActiveSection] = useState<NavSectionKey>("base");
  const logoPath = "/assets/images/logo.png";
  const { active: assetsLoading, progress } = useProgress();

  const design = stateManager.designManager;
  const mesh = stateManager.design3DManager.meshManager;

  const defaultsReady = Boolean(
    design.baseShapeManager.selectedBaseShape &&
      design.baseColorManager.selectedBaseColor &&
      design.tableTopManager.selectedTableTopData &&
      design.tableTextureManager.selectedTextureData &&
      mesh.baseShapeModelUrl &&
      mesh.topShapeModelUrl &&
      mesh.topShapeMdfUrl
  );

  useEffect(() => {
    localStorage.removeItem(PLACE_ORDER_CAPTURE_KEY);
    localStorage.removeItem(PLACE_ORDER_CAPTURE_EXPIRY_KEY);
  }, []);

  useEffect(() => {
    if (!showBootLoader) return;
    if (!defaultsReady || assetsLoading) return;

    const timer = window.setTimeout(() => {
      setShowBootLoader(false);
    }, 250);

    return () => window.clearTimeout(timer);
  }, [showBootLoader, defaultsReady, assetsLoading]);

  const updateActiveSection = useCallback(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const sections = Array.from(
      panel.querySelectorAll<HTMLElement>("[data-nav-section]")
    );
    if (sections.length === 0) return;

    const panelTop = panel.getBoundingClientRect().top;
    let current = sections[0].dataset.navSection as NavSectionKey;

    for (const section of sections) {
      const key = section.dataset.navSection as NavSectionKey | undefined;
      if (!key) continue;

      const anchor =
        section.querySelector<HTMLElement>("[data-nav-anchor]") ?? section;
      const offsetTop = anchor.getBoundingClientRect().top - panelTop;
      if (offsetTop <= 120) {
        current = key;
      } else {
        break;
      }
    }

    setActiveSection(current);
  }, []);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    const onScroll = () => updateActiveSection();
    panel.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    updateActiveSection();

    return () => {
      panel.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateActiveSection]);

  const handleSectionClick = useCallback((key: NavSectionKey) => {
    const panel = panelRef.current;
    if (!panel) return;

    const target = panel.querySelector<HTMLElement>(
      `[data-nav-section="${key}"]`
    );
    if (!target) return;

    const anchor =
      target.querySelector<HTMLElement>("[data-nav-anchor]") ?? target;

    panel.scrollTo({
      top: anchor.offsetTop - 8,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {showBootLoader && <ConfiguratorBootLoader progress={progress} />}

      {/* Navbar */}
      <Navbar
        activeSection={activeSection}
        onSectionClick={handleSectionClick}
        logoSrc={logoPath}
      />

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:flex-row overflow-hidden">
        
        {/* Left: Canvas */}
        <div className="w-full lg:w-[65%] h-[50%] lg:h-full bg-gray-200">
          <Viewer3D />
        </div>

        {/* Right: Scrollable panel */}
        <div
          ref={panelRef}
          className="w-full lg:w-[35%] h-[50%] lg:h-full overflow-y-auto bg-white border-t lg:border-t-0 lg:border-l"
        >
          <Viewer />
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
});
