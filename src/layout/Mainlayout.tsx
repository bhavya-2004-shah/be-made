import { Navbar } from "../Components/layout/Navbar";
import { Footer } from "../Components/layout/Footer";
import { Viewer3D } from "../Components/Viewer3D/Viewer3D";
import { Viewer } from "../Components/Viewer";

export const MainLayout = () => {
  return (
    <div className="h-screen w-screen flex flex-col overflow-hidden">
      {/* Navbar */}
      <Navbar />

      {/* Main content */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* Left: Canvas (65%) */}
        <div className="w-[65%]  bg-gray-200">
          <Viewer3D />
        </div>

        {/* Right: Scrollable panel (35%) */}
        <div className="w-[35%] h-full overflow-y-auto bg-white border-l">
          <Viewer/>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
};
