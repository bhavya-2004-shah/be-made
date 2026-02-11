import { OrderSampleCard } from "../Viewer/OrderSample";
import { useState } from "react";
import { OrderSampleContent } from "./OrderSampleContent";

export const Navbar = () => {
   const [open, setOpen] = useState(false);
  return (
    <div className="w-full h-16 bg-white border-b flex items-center justify-between px-8">
      {/* Logo */}
      <div className="text-3xl font-light tracking-wide">
        bemade<span className="text-xs align-super">™</span>
      </div>

      {/* Navigation */}
      <div className="flex gap-8 text-sm font-medium text-gray-700">
        <span className="border-b-2 border-black pb-1">BASE</span>
        <span className="opacity-60">BASE COLOUR</span>
        <span className="opacity-60">TOP COLOUR</span>
        <span className="opacity-60">TOP SHAPE</span>
        <span className="opacity-60">DIMENSION</span>
        <span className="opacity-60">CHAIR</span>
        <span className="opacity-60">SUMMARY</span>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        <button className="text-sm text-gray-700">
          Login / Register
        </button  >
        <button onClick={() => setOpen(true)} className="bg-black text-white text-sm px-4 py-2 rounded-full">
          Order Sample
        </button>

       <OrderSampleCard open={open} onClose={() => setOpen(false)}>
  <OrderSampleContent />
</OrderSampleCard>
      </div>
    </div>
  );
};
