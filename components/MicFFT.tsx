// Component for displaying the FFT data of the microphone visually with bars

"use client";

// Import necessary modules and utilities
import { cn } from "@/utils";
import { motion } from "framer-motion";
import { AutoSizer } from "react-virtualized";

// Define the props for the MicFFT component
interface MicFFTProps {
  fft: number[]; // Array of FFT values
  className?: string; // Optional additional class names
}

// Define the MicFFT component
export default function MicFFT({ fft, className }: MicFFTProps) {
  return (
    <div className={"relative size-full"}>
      {/* AutoSizer adjusts the size of the SVG based on the container size */}
      <AutoSizer>
        {({ width, height }) => (
          <motion.svg
            viewBox={`0 0 ${width} ${height}`}
            width={width}
            height={height}
            className={cn("absolute !inset-0 !size-full", className)}
          >
            {/* Render 24 rectangles to visualize the FFT data */}
            {Array.from({ length: 24 }).map((_, index) => {
              // Calculate the height of each rectangle based on the FFT value
              const value = (fft[index] ?? 0) / 4;
              const h = Math.min(Math.max(height * value, 2), height);
              const yOffset = height * 0.5 - h * 0.5;

              return (
                <motion.rect
                  key={`mic-fft-${index}`} // Unique key for each rectangle
                  height={h} // Set the height of the rectangle
                  width={2} // Set the width of the rectangle
                  x={2 + (index * width - 4) / 24} // Calculate the x position
                  y={yOffset} // Calculate the y position to center the rectangle
                  rx={4} // Rounded corners for the rectangle
                />
              );
            })}
          </motion.svg>
        )}
      </AutoSizer>
    </div>
  );
}
