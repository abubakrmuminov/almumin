import React, { useRef, useEffect, useState } from "react";
import {
  Bookmark as BookmarkIcon,
  Play,
  StopCircle,
  Volume2,
  Hash,
  Copy,
  Check,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import type { Ayah, Bookmark, Settings } from "../types/quran";

export interface AyahCardProps {
  ayah: Ayah;
  translation: Ayah;
  transliteration?: string;
  surahNumber: number;
  surahName: string;
  settings: Settings;
  isBookmarked: boolean;
  onToggleBookmark: (bookmark: Bookmark) => void;
  currentAyah: number | null;
  onPlay: () => void;
  onStop: () => void;

  arabicFontClass?: string;
  translationFontClass?: string;
}

export const AyahCard: React.FC<AyahCardProps> = ({
  ayah,
  translation,
  transliteration,
  surahNumber,
  surahName,
  isBookmarked,
  onToggleBookmark,
  currentAyah,
  onPlay,
  onStop,
  arabicFontClass,
  translationFontClass,
}) => {
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [copied, setCopied] = useState(false);
  const isThisPlaying = currentAyah === ayah.number;

  // Автоскролл к текущему аяту
  useEffect(() => {
    if (isThisPlaying && cardRef.current) {
      cardRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [isThisPlaying]);

  // Копирование аята + ссылка
  const handleCopy = async () => {
    try {
      const url = `${window.location.origin}/surah/${surahNumber}#ayah-${ayah.numberInSurah}`;
      const textToCopy = `${ayah.text}\n\n${translation.text}\n(${surahName} ${ayah.numberInSurah})\n\n🔗 ${url}`;

      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Не удалось скопировать", err);
    }
  };

  return (
    <motion.div
      ref={cardRef}
      data-ayah={ayah.numberInSurah}
      id={`ayah-${ayah.numberInSurah}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`relative rounded-xl p-6 sm:p-8 transition-all duration-500 shadow-lg border ${
        isThisPlaying
          ? "border-[#d4af37]/60 bg-gradient-to-br from-[#1a1818] to-[#0f0e0e]"
          : "border-[#1a1818] bg-[#0f0e0e]"
      }`}
    >
      {/* Индикатор проигрывания */}
      {isThisPlaying && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-[#d4af37]/70 rounded-t-xl"></div>
      )}

      {/* Верхняя часть: номер и кнопки */}
      <div className="flex items-start justify-between mb-6">
        {/* Номер аята */}
        <div className="flex items-center gap-3">
          <div
            className={`flex items-center justify-center w-10 h-10 rounded-lg text-sm font-bold border ${
              isThisPlaying
                ? "bg-[#1a1818] text-[#d4af37] border-[#d4af37]"
                : "bg-[#0f0e0e] text-gray-400 border-[#1a1818]"
            }`}
          >
            {ayah.numberInSurah}
          </div>
          {isThisPlaying && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 text-sm font-medium text-[#d4af37]"
            >
              <Volume2 className="w-4 h-4" />
              Now Playing
            </motion.div>
          )}
        </div>

        {/* Кнопки действий */}
        <div className="flex items-center gap-2">
          {/* Bookmark */}
          <motion.button
            onClick={() =>
              onToggleBookmark({
                surahNumber,
                ayahNumber: ayah.numberInSurah,
                surahName,
                text: ayah.text,
                translation: translation.text,
              })
            }
            className={`p-2.5 rounded-lg transition-all ${
              isBookmarked
                ? "text-[#d4af37] bg-[#d4af37]/20 hover:bg-[#d4af37]/30"
                : "text-gray-400 hover:text-[#d4af37] hover:bg-[#d4af37]/10"
            }`}
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
          >
            <BookmarkIcon
              className={`w-5 h-5 ${isBookmarked ? "fill-current" : ""}`}
            />
          </motion.button>

          {/* Copy */}
          <motion.button
            onClick={handleCopy}
            className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#d4af37]/10 transition-all relative"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <AnimatePresence mode="wait" initial={false}>
              {copied ? (
                <motion.div
                  key="check"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Check className="w-5 h-5 text-[#d4af37]" />
                </motion.div>
              ) : (
                <motion.div
                  key="copy"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                >
                  <Copy className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Play / Stop */}
          {isThisPlaying ? (
            <motion.button
              onClick={onStop}
              className="p-2.5 rounded-lg text-red-400 bg-red-500/20 hover:bg-red-500/30 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <StopCircle className="w-5 h-5" />
            </motion.button>
          ) : (
            <motion.button
              onClick={onPlay}
              className="p-2.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#d4af37]/10 transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Play className="w-5 h-5" />
            </motion.button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Арабский текст */}
        <p
          className={`font-arabic leading-loose ${
            arabicFontClass || "text-4xl"
          } text-right`}
          dir="rtl"
        >
          {ayah.text}
        </p>

        {/* Транскрипция */}
        {transliteration && (
          <p className="text-[#d4af37]/80 leading-relaxed text-sm italic">
            {transliteration}
          </p>
        )}

        {/* Перевод */}
        <p
          className={`text-gray-300 leading-relaxed ${
            translationFontClass || "text-base"
          }`}
        >
          {translation.text}
        </p>
      </div>

      {/* Метаданные */}
      <div className="flex items-center justify-between pt-4 mt-4 text-xs text-gray-500 border-t border-[#1a1818]">
        <div className="flex items-center gap-4">
          <span>Juz {ayah.juz}</span>
          <span>Page {ayah.page}</span>
        </div>
        <div className="flex items-center gap-1">
          <Hash className="w-3 h-3 text-[#d4af37]" />
          <span>{ayah.number}</span>
        </div>
      </div>
    </motion.div>
  );
};
