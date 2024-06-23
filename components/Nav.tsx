"use client";

import { useState } from "react";
import logo from './images/socratesLogo.png';
import { Button } from "./ui/button";
import { Menu } from "lucide-react";

export const Nav = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen((prev) => !prev);
  };

  return (
    <>
    <div
      className={
        "px-4 py-2 flex items-center h-14 z-50 bg-[#F4EDD8] border-b border-[#915018] font-[Press Start 2P] pixelate"
      }
    >
      <div className="flex items-center gap-2">
        <img src={logo.src} alt="Logo" style={{ width: '40px', height: '40px' }} />
        <span className="text-lg font-bold text-[#6C3F18] ">Consider This</span>
      </div>
      <div className="flex-1 flex justify-center items-center relative">
        <h1 style={{ fontSize: '0.65rem' }} className="text-center text-[#6C3F18] font-[Press Start 2P]">Made with ♡ at the Berkeley AI Hackathon</h1>
      </div>

      <div className={"ml-auto flex items-center gap-1"}>
        <Button
          onClick={toggleMenu}
          variant={"ghost"}
          className={"flex items-center gap-1.5 text-[#6C3F18] hover:text-black"}
        >
          <Menu className={"size-4"} />
        </Button>
      </div>
      {menuOpen && (
        <div className="absolute top-14 right-0 bg-[#F4EDD8] border border-[#915018] p-2 rounded-sm">
          <Button className="w-full mb-2 text-[#6C3F18] hover:text-black">Menu Item 1</Button>
          <Button className="w-full mb-2 text-[#6C3F18] hover:text-black">Menu Item 2</Button>
          <Button className="w-full text-[#6C3F18] hover:text-black">Menu Item 3</Button>
        </div>
      )}
    </div>
    </>
  );
};
