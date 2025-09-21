import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { AyahCard } from "./AyahCard";
import { quranApi } from "../api/quran";
import { useLocalStorage } from "../hooks/useLocalStorage";
import type { Bookmark, Settings, LastRead, Ayah } from "../types/quran";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { SurahSkeleton } from "./SurahSkeleton";

interface SurahPageProps {
  settings: Settings;
}

export const SurahPage: React.FC<SurahPageProps> = ({ settings }) => {
  const { id } = useParams<{ id: string }>();
  const surahNumber = Number(id);
  const navigate = useNavigate();
  const location = useLocation();

  const [surahData, setSurahData] = useState<any>(null);
  const [translationData, setTranslationData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [bookmarks, setBookmarks] = useLocalStorage<Bookmark[]>(
    "bookmarks",
    []
  );
  const [, setLastRead] = useLocalStorage<LastRead | null>("lastRead", null);

  const currentAudioRef = useRef<HTMLAudioElement | null>(null);
  const [currentAyah, setCurrentAyah] = useState<number | null>(null);

  const fontSizeMap: Record<string, string> = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg sm:text-xl",
  };
  const fontSizeClass = fontSizeMap[settings.fontSize] || "text-base";

  const arabicFontMap = {
    small: "text-2xl sm:text-3xl",
    medium: "text-4xl sm:text-5xl",
    large: "text-5xl sm:text-6xl",
  };

  const translationFontMap = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg sm:text-xl",
  };

  const arabicFontClass = arabicFontMap[settings.fontSize] || "text-4xl";
  const translationFontClass =
    translationFontMap[settings.fontSize] || "text-base";

  // Загружаем суру
  useEffect(() => {
    const loadSurah = async () => {
      setLoading(true);
      try {
        const [arabicData, translationData] = await Promise.all([
          quranApi.getSurah(surahNumber),
          quranApi.getSurahWithTranslation(surahNumber, settings.translation),
        ]);
        setSurahData(arabicData);
        setTranslationData(translationData);
      } catch (error) {
        console.error("Error loading surah:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSurah();
  }, [surahNumber, settings.translation]);

  // Сохраняем первый аят как LastRead при загрузке
  useEffect(() => {
    if (!surahData) return;
    const firstAyahText = surahData.ayahs?.[0]?.text || ""; // берем текст первого аята
    setLastRead((prev) => {
      if (prev?.surahNumber === surahNumber) return prev;
      return {
        surahNumber,
        ayahNumber: 1,
        surahName: surahData.englishName,
        timestamp: Date.now(),
        text: firstAyahText,
      };
    });
  }, [surahData, surahNumber]);

  // Обновляем LastRead при скролле
  useEffect(() => {
    const handleScroll = () => {
      const ayahElements = document.querySelectorAll("[data-ayah]");
      let firstVisibleAyah: number | null = null;
      ayahElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        if (
          rect.top >= 0 &&
          rect.top < window.innerHeight / 2 &&
          !firstVisibleAyah
        ) {
          firstVisibleAyah = Number(el.getAttribute("data-ayah"));
        }
      });
      if (firstVisibleAyah) {
        const ayah = surahData.ayahs.find(
          (a: Ayah) => a.numberInSurah === firstVisibleAyah
        );
        setLastRead({
          surahNumber,
          ayahNumber: firstVisibleAyah,
          surahName: surahData.englishName,
          text: ayah ? ayah.text : "", // сюда текст аята
          timestamp: Date.now(),
        });
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [surahNumber, surahData, setLastRead]);

  // Скролл при переходе с LastRead или Bookmarks
  useEffect(() => {
    if (!surahData) return;
    const state = location.state as
      | { fromLastRead?: boolean; fromBookmark?: boolean; ayahNumber?: number }
      | undefined;
    let targetAyahNumber: number | null = null;

    if (state?.fromLastRead) {
      const lastRead = JSON.parse(localStorage.getItem("lastRead") || "null");
      if (lastRead?.surahNumber === surahNumber)
        targetAyahNumber = lastRead.ayahNumber;
    } else if (state?.fromBookmark && state.ayahNumber) {
      targetAyahNumber = state.ayahNumber;
    }

    if (targetAyahNumber) {
      const el = document.getElementById(`ayah-${targetAyahNumber}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        el.classList.add("ring-2", "ring-yellow-400");
        setTimeout(
          () => el.classList.remove("ring-2", "ring-yellow-400"),
          2000
        );
      }
    }
  }, [surahData, surahNumber, location.state]);

  // Аудио
  const playAyah = async (ayahIndex: number) => {
    try {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.onended = null;
        currentAudioRef.current.src = "";
        currentAudioRef.current = null;
      }
      const ayah = surahData.ayahs[ayahIndex];
      const audioData = await quranApi.getAyahAudio(
        surahNumber,
        ayah.numberInSurah,
        settings.reciter
      );
      if (audioData.audio) {
        const audio = new Audio(audioData.audio);
        currentAudioRef.current = audio;
        setCurrentAyah(ayah.number);
        audio.onended = () => {
          const nextIndex = ayahIndex + 1;
          if (nextIndex < surahData.ayahs.length) playAyah(nextIndex);
          else setCurrentAyah(null);
        };
        await audio.play();
      }
    } catch {
      if (currentAudioRef.current) {
        currentAudioRef.current.pause();
        currentAudioRef.current.onended = null;
        currentAudioRef.current.src = "";
        currentAudioRef.current = null;
      }
      setCurrentAyah(null);
    }
  };

  const stopAudio = () => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current.currentTime = 0;
      currentAudioRef.current.onended = null;
      currentAudioRef.current.src = "";
      currentAudioRef.current = null;
    }
    setCurrentAyah(null);
  };

  useEffect(() => () => stopAudio(), [location.pathname]);

  const handleToggleBookmark = (bookmark: Bookmark) => {
    setBookmarks((prev) => {
      const isBookmarked = prev.some(
        (b) =>
          b.surahNumber === bookmark.surahNumber &&
          b.ayahNumber === bookmark.ayahNumber
      );
      return isBookmarked
        ? prev.filter(
            (b) =>
              !(
                b.surahNumber === bookmark.surahNumber &&
                b.ayahNumber === bookmark.ayahNumber
              )
          )
        : [...prev, bookmark];
    });
  };

  const isBookmarked = (ayahNumber: number) =>
    bookmarks.some(
      (b) => b.surahNumber === surahNumber && b.ayahNumber === ayahNumber
    );

  if (loading) return <SurahSkeleton />;

  if (!surahData || !translationData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="mb-4 text-red-500">Ошибка загрузки суры</p>
        <button
          onClick={() => navigate("/")}
          className="flex items-center px-4 py-2 text-gray-200 transition bg-gray-700 rounded-lg hover:bg-gray-600"
        >
          <ArrowLeft className="w-4 h-4 mr-2" /> Назад
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-full p-6 pt-20 mx-auto bg-[#0A0A0A] min-h-screen"
    >
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-2 text-3xl font-bold text-white">{surahData.name}</h1>
        <div className="text-gray-400">
          {surahData.englishName} — {surahData.englishNameTranslation}
        </div>
        <div className="mt-2 text-sm text-gray-500">
          {surahData.numberOfAyahs} аятов
        </div>
      </div>

      <div className="flex flex-col items-center space-y-5">
        {surahData.ayahs.map((ayah: any, index: number) => (
          <div
            key={ayah.number}
            className="w-full sm:w-11/12 md:w-3/4 lg:w-2/3"
          >
            <AyahCard
              fontSizeClass={fontSizeClass}
              ayah={ayah}
              translation={translationData.ayahs[index]}
              surahNumber={surahNumber}
              surahName={surahData.englishName}
              settings={settings}
              isBookmarked={isBookmarked(ayah.numberInSurah)}
              onToggleBookmark={handleToggleBookmark}
              currentAyah={currentAyah}
              onPlay={() => playAyah(index)}
              onStop={stopAudio}
              arabicFontClass={arabicFontClass}
              translationFontClass={translationFontClass}
            />
          </div>
        ))}
      </div>
    </motion.div>
  );
};
