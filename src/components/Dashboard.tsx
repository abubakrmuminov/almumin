import React, { useEffect, useState } from "react";
import { Clock, BookOpen, Search as SearchIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { SurahList } from "./SurahList";
import type { LastRead, Settings, Surah } from "../types/quran";
import { useNavigate } from "react-router-dom";
import { quranApi } from "../api/quran";

interface DashboardProps {
  settings: Settings;
}

interface AyahData {
  text: string;
  surah: { englishName: string; name: string };
  numberInSurah: number;
  number: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ settings }) => {
  const [lastRead] = useLocalStorage<LastRead | null>("lastRead", null);
  const [ayahOfTheDay, setAyahOfTheDay] = useState<AyahData | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchFilter, setSearchFilter] = useState("");
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Аят дня
    const today = new Date();
    const totalAyahs = 6236;

    // Дата в формате YYYY-MM-DD
    const todayString = today.toISOString().split("T")[0];

    // Генерация "сид" из строки даты
    let hash = 0;
    for (let i = 0; i < todayString.length; i++) {
      hash = todayString.charCodeAt(i) + ((hash << 5) - hash);
    }

    // Псевдослучайное число на основе хэша
    const random = Math.abs(Math.sin(hash) * 10000);
    const ayahNumber = (Math.floor(random) % totalAyahs) + 1;

    const fetchAyah = async () => {
      try {
        const res = await fetch(
          `https://api.alquran.cloud/v1/ayah/${ayahNumber}`
        );
        const data = await res.json();
        setAyahOfTheDay({
          text: data.data.text,
          surah: {
            englishName: data.data.surah.englishName,
            name: data.data.surah.name,
          },
          numberInSurah: data.data.numberInSurah,
          number: data.data.number,
        });
      } catch (err) {
        console.error(err);
      }
    };

    fetchAyah();

    // Подгружаем все суры для поиска
    const loadSurahs = async () => {
      try {
        const data = await quranApi.getSurahs();
        setSurahs(data);
      } catch (err) {
        console.error(err);
      }
    };
    loadSurahs();
  }, []);

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      surah.englishNameTranslation
        .toLowerCase()
        .includes(searchFilter.toLowerCase()) ||
      surah.number.toString().includes(searchFilter)
  );

  return (
    <div className="min-h-screen pt-16 text-white bg-black">
      {/* Header */}
      <div className="relative z-10 px-6 py-8 text-center">
        <motion.h1
          className="text-5xl font-bold text-center text-yellow-400 sm:text-6xl"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          AlMumin Quran
        </motion.h1>

        {/* Bottom Buttons */}
        <div className="flex justify-center mt-4 space-x-4">
          <motion.button
            onClick={() =>
              lastRead &&
              navigate(`/surah/${lastRead.surahNumber}`, {
                state: { fromLastRead: true },
              })
            }
            className="flex items-center px-4 py-2 space-x-2 text-black bg-yellow-400 rounded-lg hover:bg-yellow-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Clock className="w-4 h-4" />
            <span className="text-sm font-medium">Continue</span>
          </motion.button>

          <motion.button
            onClick={() => setSearchOpen(true)}
            className="flex items-center px-4 py-2 space-x-2 text-yellow-400 bg-gray-800 rounded-lg hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <SearchIcon className="w-4 h-4" />
            <span className="text-sm font-medium">Search</span>
          </motion.button>

          <motion.button
            onClick={() => navigate("/bookmarks")}
            className="flex items-center px-4 py-2 space-x-2 text-yellow-400 bg-gray-800 rounded-lg hover:bg-gray-700"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <BookOpen className="w-4 h-4" />
            <span className="text-sm font-medium">Bookmarks</span>
          </motion.button>
        </div>

        <div className="flex flex-col items-center justify-center mt-12 space-y-6">
          {/* Last Read */}
          {lastRead && (
            <div className="w-full max-w-3xl">
              <div className="p-6 border border-gray-800 shadow-lg bg-black/90 rounded-2xl">
                <span className="text-xs text-gray-400 uppercase">
                  Last Read
                </span>
                <div className="flex items-center justify-between mt-2">
                  <div>
                    <h3 className="text-lg font-semibold text-white">
                      {lastRead.surahName}
                    </h3>
                    <p className="text-sm text-gray-400">
                      Ayah {lastRead.ayahNumber}
                    </p>
                    {lastRead.date && (
                      <p className="mt-1 text-xs text-gray-500">
                        {new Date(lastRead.date).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                  <motion.button
                    onClick={() =>
                      navigate(`/surah/${lastRead.surahNumber}`, {
                        state: {
                          fromLastRead: true,
                          ayahNumber: lastRead.ayahNumber,
                        },
                      })
                    }
                    className="flex items-center justify-center px-3 py-2 text-black transition-all bg-yellow-500 rounded-lg hover:bg-yellow-400"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <BookOpen className="w-4 h-4 mr-1" />
                    <span className="text-sm font-medium">Read</span>
                  </motion.button>
                </div>
              </div>
            </div>
          )}

          {/* Ayah of the Day */}
          {ayahOfTheDay && (
            <div className="w-full max-w-3xl">
              <div className="p-6 border border-gray-800 shadow-lg bg-black/90 rounded-2xl">
                <span className="text-xs text-gray-400 uppercase">
                  Ayah of the Day
                </span>
                <p className="mt-2 mb-4 text-lg italic text-center text-white">
                  “{ayahOfTheDay.text}”
                </p>
                <p className="text-sm text-center text-gray-400">
                  {ayahOfTheDay.surah.englishName} ({ayahOfTheDay.surah.name}) —
                  Ayah {ayahOfTheDay.numberInSurah}
                </p>
                <div className="flex justify-center mt-4"></div>
              </div>
            </div>
          )}

          <div className="flex justify-center mt-6">
            <motion.a
              href="https://namaz.mumin.ink"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-5 py-2.5 space-x-2 text-black bg-yellow-400 rounded-lg hover:bg-yellow-300 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Clock className="w-4 h-4" />
              <span className="text-sm font-medium">Check Prayer Times</span>
            </motion.a>
          </div>
        </div>
      </div>

      {/* Surah List Section */}
      <div className="relative z-10 px-4 pb-20 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <SurahList />
      </div>

      {/* Search Modal */}
      {searchOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center p-6 bg-black/70 backdrop-blur-sm"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="w-full max-w-2xl p-6 shadow-lg bg-black/80 rounded-2xl"
          >
            <div className="flex items-center mb-4 space-x-2">
              <input
                type="text"
                placeholder="Search chapters..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full p-3 text-white bg-gray-800 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400"
              />
              <motion.button
                onClick={() => setSearchOpen(false)}
                className="px-3 py-2 text-black bg-yellow-500 rounded-lg hover:bg-yellow-400"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Close
              </motion.button>
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredSurahs.map((surah) => (
                <motion.div
                  key={surah.number}
                  className="flex items-center justify-between p-3 rounded-lg cursor-pointer hover:bg-gray-700"
                  onClick={() => {
                    navigate(`/surah/${surah.number}`);
                    setSearchOpen(false);
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  <span>{surah.englishName}</span>
                  <span className="text-sm text-gray-400">
                    {surah.numberOfAyahs} ayahs
                  </span>
                </motion.div>
              ))}
              {filteredSurahs.length === 0 && (
                <p className="py-4 text-center text-gray-400">
                  No results found
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};
