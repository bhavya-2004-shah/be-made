import { OrderSampleCard } from "../Viewer/OrderSample";
import { useState } from "react";
import { OrderSampleContent } from "./OrderSampleContent";

export type NavSectionKey =
  | "base"
  | "base-color"
  | "top-color"
  | "top-shape"
  | "dimension"
  | "chair"
  | "summary";

type NavbarProps = {
  activeSection: NavSectionKey;
  onSectionClick: (section: NavSectionKey) => void;
  logoSrc?: string;
};

const NAV_ITEMS: { key: NavSectionKey; label: string }[] = [
  { key: "base", label: "BASE" },
  { key: "base-color", label: "BASE COLOUR" },
  { key: "top-color", label: "TOP COLOUR" },
  { key: "top-shape", label: "TOP SHAPE" },
  { key: "dimension", label: "DIMENSION" },
  { key: "chair", label: "CHAIR" },
  { key: "summary", label: "SUMMARY" },
];

export const Navbar = ({ activeSection, onSectionClick, logoSrc }: NavbarProps) => {
  const [open, setOpen] = useState(false);
  const [logoError, setLogoError] = useState(false);

  return (
    <div className="w-full bg-white border-b flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8">
        
          <img
            src={"/assets/images/header_logo.svg"}
            alt="BeMade"
            className="h-8 md:h-10 w-auto object-contain"
            onError={() => setLogoError(true)}
          />
        

        <div className="hidden md:flex gap-4 lg:gap-8 text-xs md:text-sm font-medium text-gray-700">
          {NAV_ITEMS.map((item) => {
            const isActive = activeSection === item.key;

            return (
              <button
                key={item.key}
                onClick={() => onSectionClick(item.key)}
                className={`pb-1 border-b-2 transition ${
                  isActive
                    ? "border-black text-gray-900"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2 md:gap-4">
          <button className="text-xs md:text-sm text-gray-700 whitespace-nowrap">
            Login / Register
          </button>

          <button
            onClick={() => setOpen(true)}
            className="bg-black text-white text-xs md:text-sm px-3 md:px-4 py-2 rounded-full whitespace-nowrap"
          >
            Order Sample
          </button>

          <OrderSampleCard open={open} onClose={() => setOpen(false)}>
            <OrderSampleContent />
          </OrderSampleCard>
        </div>
      </div>

      <div className="flex md:hidden px-4 overflow-x-auto gap-4 text-xs font-medium text-gray-700 border-t bg-white h-12 items-center">
        {NAV_ITEMS.map((item) => {
          const isActive = activeSection === item.key;

          return (
            <button
              key={item.key}
              onClick={() => onSectionClick(item.key)}
              className={`pb-1 border-b-2 whitespace-nowrap transition ${
                isActive
                  ? "border-black text-gray-900"
                  : "border-transparent text-gray-500"
              }`}
            >
              {item.label}
            </button>
          );
        })}
      </div>
    </div>
  );
};
