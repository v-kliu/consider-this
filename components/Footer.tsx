// Footer Component rendered on the landing screen of Consider This

// Tells next.js to render only on client
"use client";

// Imports school logo images
import logoSuyash from './images/uiucLogo.jpg';
import logoLucas from './images/calLogo.jpg';
import logoVictor from './images/washingtonLogo.png';
import logoPelle from './images/boulderLogo.jpg';

// Footer component
export const Footer = () => {
  // Names of our 4 people hacker team for the footer
  const names = [
    { logo: logoSuyash, name: "Suyash N.", color: "#1F4B8E" },
    { logo: logoLucas, name: "Juan Lucas U.", color: "#003D99" },
    { logo: logoPelle, name: "Pelle K.", color: "#333333" },
    { logo: logoVictor, name: "Victor L.", color: "#603FA3" }
  ];

  return (
    <>
      <footer className="flex flex-col w-full fixed bottom-0 bg-[#F4EDD8] border-t border-[#915018] py-2 font-[Press Start 2P]">
        <div className="flex justify-around items-center h-full min-h-8">
          {/* Maps the names of the 4 people in the footer */}
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
