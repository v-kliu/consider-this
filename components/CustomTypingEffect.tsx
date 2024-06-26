// Additional componenet used to render the typing effect

// Imports React and hooks for state and effect management
import React, { useState, useEffect } from 'react';

// Props for CustomTypingEffect
interface CustomTypingEffectProps {
  lines: string[];
  speed: number;
  pauseDelay: number;
}

// CustomTypingEffect component
const CustomTypingEffect: React.FC<CustomTypingEffectProps> = ({ lines, speed, pauseDelay }) => {
  // State to manage the current text being typed
  const [currentText, setCurrentText] = useState('');
  // State to manage the current line being typed
  const [currentLine, setCurrentLine] = useState(0);
  // State to determine if typing is in progress
  const [isTyping, setIsTyping] = useState(true);
  // State to determine if erasing is in progress
  const [isErasing, setIsErasing] = useState(false);
  // State to manage if a pause has occurred after typing a line
  const [hasPaused, setHasPaused] = useState(false);

  useEffect(() => {
    // Variable to store the timeout for typing/erasing effect
    let timeout: NodeJS.Timeout;

    // Typing effect
    if (isTyping) {
      if (currentText.length < lines[currentLine].length) {
        // If there are more characters to type, add the next character
        timeout = setTimeout(() => {
          setCurrentText((prev) => prev + lines[currentLine][currentText.length]);
        }, speed);
      } else {
        // Once the line is fully typed, initiate a pause
        if (!hasPaused) {
          timeout = setTimeout(() => {
            setHasPaused(true);
            setIsTyping(false);
            // If there are more lines, move to the next line
            if (currentLine < lines.length - 1) {
              setCurrentLine((prev) => prev + 1);
              setCurrentText('');
              setIsTyping(true);
              setHasPaused(false);
            } else {
              // If all lines are typed, start erasing
              setIsErasing(true);
            }
          }, pauseDelay);
        }
      }
    } else if (isErasing) {
      // Erasing effect
      if (currentText.length > 0) {
        // If there are characters to erase, remove the last character
        timeout = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, prev.length - 1));
        }, speed);
      } else {
        // If the current line is fully erased, move to the previous line
        if (currentLine > 0) {
          setCurrentLine((prev) => prev - 1);
        } else {
          // Reset to start typing from the beginning with a shorter pause
          timeout = setTimeout(() => {
            setIsErasing(false);
            setIsTyping(true);
            setCurrentLine(0);
            setHasPaused(false);
          }, pauseDelay / 2);  // Use half the pause time when restarting
        }
      }
    }

    // Cleanup the timeout on component unmount or when dependencies change
    return () => clearTimeout(timeout);
  }, [currentText, currentLine, isTyping, isErasing, hasPaused, lines, speed, pauseDelay]);

  return (
    <div className="text-lg text-gray-600 max-w-xl mx-auto leading-loose">
      {/* Render the lines that are already typed */}
      {lines.slice(0, currentLine).map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      {/* Render the current text being typed or erased */}
      <div>{currentText}</div>
    </div>
  );
};

export default CustomTypingEffect;
