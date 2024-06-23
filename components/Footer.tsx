"use client";

import logoSuyash from './images/uiucLogo.jpg';
import logoLucas from './images/calLogo.jpg';
import logoVictor from './images/washingtonLogo.png';
import logoPelle from './images/boulderLogo.jpg';

export const Footer = () => {
  const names = [
    { logo: logoSuyash, name: "Suyash N.", color: "#1F4B8E" },
    { logo: logoLucas, name: "Lucas U.", color: "#003D99" },
    { logo: logoPelle, name: "Pelle K.", color: "#333333" },
    { logo: logoVictor, name: "Victor L.", color: "#603FA3" }
  ];

  return (
    <>
      <footer className="flex flex-col w-full fixed bottom-0 bg-[#F4EDD8] border-t border-[#915018] py-2 font-[Press Start 2P]">
        <div className="flex justify-around items-center h-full min-h-8">
          {names.map((person, index) => (
            <div
              key={index}
              className="flex items-center space-x-2 h-full"
            >
              <img src={person.logo.src} alt={`${person.name} Logo`} className="w-6 h-6" />
              <h1 className="text-sm flex" style={{ color: person.color }}>
                {person.name}
              </h1>
            </div>
          ))}
        </div>
      </footer>
    </>
  );
};
