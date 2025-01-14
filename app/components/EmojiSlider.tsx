"use client";

import { getEmojiForDegree } from "@/utils/emoji-degree";
import React, { useState, useEffect } from "react";

interface EmojiSliderProps {
  value: number;
  onChange: (value: number) => void;
}

const EmojiSlider: React.FC<EmojiSliderProps> = ({ value, onChange }) => {
  const [sliderValue, setSliderValue] = useState(value);

  useEffect(() => {
    setSliderValue(value);
  }, [value]);

  const handleClick = (newValue: number) => {
    setSliderValue(newValue);
    onChange(newValue);
  };

  const getDescription = (degree: number) => {
    switch (degree) {
      case 1:
        return "Légère";
      case 2:
        return "Simple";
      case 3:
        return "Complète";
      default:
        return "";
    }
  };

  const getDetailedDescription = (degree: number) => {
    switch (degree) {
      case 1:
        return "Subtile";
      case 2:
        return "Équilibrée";
      case 3:
        return "Transformation";
      default:
        return "";
    }
  };

  return (
    <div className="space-y-2">
      <div className="relative">
        <div className="flex justify-center items-center">
          <span className="text-sm font-medium ">Degré de reformulation</span>
        </div>

        {/* Emoji markers */}
        <div className="w-full flex justify-between px-4 mt-6">
          {[1, 2, 3].map((degree) => (
            <button
              key={degree}
              type="button"
              onClick={() => handleClick(degree)}
              className={`w-12 h-12 rounded-full flex flex-col items-center justify-center transition-all duration-300 ${
                sliderValue === degree
                  ? "bg-gradient-to-r from-indigo-600/10 to-purple-600/10 scale-110 shadow-md animate-float"
                  : "bg-white hover:bg-gray-50 hover:scale-105"
              }`}
              style={{
                border: sliderValue === degree ? "2px solid transparent" : "1px solid #e5e7eb",
                backgroundClip: sliderValue === degree ? "padding-box, border-box" : "",
                backgroundImage:
                  sliderValue === degree
                    ? "linear-gradient(white, white), linear-gradient(to right, #6366f1, #9333ea)"
                    : "",
              }}
            >
              <span
                className={`select-none ${
                  sliderValue === degree ? "text-indigo-600" : "text-gray-500"
                }`}
              >
                {getEmojiForDegree(degree)}
              </span>
            </button>
          ))}
        </div>

        {/* Labels */}
        <div className="w-full flex justify-between px-4 pt-2">
          {[1, 2, 3].map((degree) => (
            <div
              key={degree}
              className={`flex flex-col items-center transition-all duration-300 ${
                sliderValue === degree ? "opacity-100 scale-105 animate-slideIn" : "opacity-70"
              }`}
              style={{ width: "3rem" }}
            >
              <span
                className={`text-xs font-medium text-center ${
                  sliderValue === degree
                    ? degree === 1
                      ? "text-indigo-600"
                      : degree === 2
                      ? "text-indigo-500"
                      : "text-purple-600"
                    : "text-gray-700"
                }`}
              >
                {getDescription(degree)}
              </span>
              <span className="text-xs text-center text-gray-500 mt-1">
                {getDetailedDescription(degree)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default EmojiSlider;
