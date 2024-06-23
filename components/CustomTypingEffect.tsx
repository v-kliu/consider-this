import React, { useState, useEffect } from 'react';

interface CustomTypingEffectProps {
  lines: string[];
  speed: number;
  eraseDelay: number;
  typingDelay: number;
  pauseDelay: number;
}

const CustomTypingEffect: React.FC<CustomTypingEffectProps> = ({ lines, speed, eraseDelay, typingDelay, pauseDelay }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentLine, setCurrentLine] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [isErasing, setIsErasing] = useState(false);
  const [hasPaused, setHasPaused] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isTyping) {
      if (currentText.length < lines[currentLine].length) {
        timeout = setTimeout(() => {
          setCurrentText((prev) => prev + lines[currentLine][currentText.length]);
        }, speed);
      } else {
        if (!hasPaused) {
          timeout = setTimeout(() => {
            setHasPaused(true);
            setIsTyping(false);
            if (currentLine < lines.length - 1) {
              setCurrentLine((prev) => prev + 1);
              setCurrentText('');
              setIsTyping(true);
              setHasPaused(false);
            } else {
              setIsErasing(true);
            }
          }, pauseDelay);
        }
      }
    } else if (isErasing) {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText((prev) => prev.slice(0, prev.length - 1));
        }, speed);
      } else {
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

    return () => clearTimeout(timeout);
  }, [currentText, currentLine, isTyping, isErasing, hasPaused, lines, speed, pauseDelay]);

  return (
    <div className="text-lg text-gray-600 max-w-xl mx-auto leading-loose">
      {lines.slice(0, currentLine).map((line, index) => (
        <div key={index}>{line}</div>
      ))}
      <div>{currentText}</div>
    </div>
  );
};

export default CustomTypingEffect;