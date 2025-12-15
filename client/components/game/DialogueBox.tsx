"use client";

import { useState, useEffect, useRef } from "react";

interface DialogueBoxProps {
  text: string;
  speaker?: string;
  choices?: Array<{ id: number; text: string }>;
  onClose: () => void;
  onChoice?: (choiceId: number) => void;
  autoClose?: boolean;
  autoCloseDelay?: number;
}

export default function DialogueBox({
  text,
  speaker,
  choices,
  onClose,
  onChoice,
  autoClose = false,
  autoCloseDelay = 3000,
}: DialogueBoxProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [showChoices, setShowChoices] = useState(false);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Typewriter effect
  useEffect(() => {
    if (!text) return;

    setDisplayedText("");
    setIsTyping(true);
    setShowChoices(false);

    let currentIndex = 0;
    const typingSpeed = 30; // milliseconds per character

    typingIntervalRef.current = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1));
        currentIndex++;
      } else {
        setIsTyping(false);
        if (choices && choices.length > 0) {
          setShowChoices(true);
        } else if (autoClose) {
          setTimeout(() => {
            onClose();
          }, autoCloseDelay);
        }
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
        }
      }
    }, typingSpeed);

    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
    };
  }, [text, choices, autoClose, autoCloseDelay, onClose]);

  const handleContinue = () => {
    if (isTyping) {
      // Skip typing animation
      setDisplayedText(text);
      setIsTyping(false);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (choices && choices.length > 0) {
        setShowChoices(true);
      } else if (autoClose) {
        setTimeout(() => {
          onClose();
        }, autoCloseDelay);
      }
    } else {
      onClose();
    }
  };

  const handleChoice = (choiceId: number) => {
    if (onChoice) {
      onChoice(choiceId);
    }
    onClose();
  };

  return (
    <div className="absolute bottom-0 left-0 right-0 z-50 pointer-events-auto">
      <div className="bg-black/90 border-t-4 border-amber-600 p-6 shadow-2xl font-pixel">
        {/* Speaker name */}
        {speaker && (
          <div className="text-amber-400 text-sm mb-2 uppercase">
            {speaker}
          </div>
        )}

        {/* Dialogue text */}
        <div className="text-zinc-200 text-base leading-relaxed mb-4 min-h-[60px]">
          {displayedText}
          {isTyping && (
            <span className="inline-block w-2 h-5 bg-amber-400 ml-1 animate-pulse">
              |
            </span>
          )}
        </div>

        {/* Choices */}
        {showChoices && choices && choices.length > 0 && (
          <div className="space-y-2 mb-4">
            {choices.map((choice) => (
              <button
                key={choice.id}
                onClick={() => handleChoice(choice.id)}
                className="block w-full text-left bg-zinc-800 hover:bg-zinc-700 border-2 border-zinc-600 hover:border-amber-500 px-4 py-2 text-sm transition-all"
              >
                {choice.text}
              </button>
            ))}
          </div>
        )}

        {/* Continue button */}
        {!showChoices && (
          <button
            onClick={handleContinue}
            className="bg-amber-600 hover:bg-amber-500 border-2 border-amber-800 px-6 py-2 text-sm font-pixel transition-all active:translate-y-0.5"
          >
            {isTyping ? "SKIP" : "TIẾP TỤC"}
          </button>
        )}
      </div>
    </div>
  );
}

