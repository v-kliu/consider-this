"use client";

import { useEffect } from "react";
import Logo from "./logos/socratesLogo.png";

export const Nav = () => {
  useEffect(() => {
    // Add the overflow-hidden class to the body when the Nav component is mounted
    document.body.classList.add('overflow-hidden');

    // Remove the overflow-hidden class from the body when the Nav component is unmounted
    return () => {
      document.body.classList.remove('overflow-hidden');
    };
  }, []);

  return (
    <>
      <div
        className={
          "relative px-4 py-2 flex items-center h-14 z-50 bg-[#F4EDD8] border-b border-[#915018] font-[Press Start 2P]"
        }
      >
        <div className="absolute left-4 flex items-center gap-2">
          <img src={Logo.src} alt="Logo" style={{ width: '40px', height: '40px' }} />
          <span className="text-lg font-bold text-[#6C3F18]">Consider This</span>
        </div>
        <div className="w-full text-center">
          <h1
            style={{ fontSize: '0.65rem' }}
            className="text-center text-[#6C3F18] font-[Press Start 2P]"
          >
            Made with ♡ at the Berkeley AI Hackathon
          </h1>
        </div>
      </div>
    </>
  );
};
