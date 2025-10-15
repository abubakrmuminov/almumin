import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { quranApi } from "../api/quran";
import { Pagination } from "./Pagination";
import type { Surah } from "../types/quran";
import { useNavigate } from "react-router-dom";

export const SurahList: React.FC = () => {
  const [surahs, setSurahs] = useState<Surah[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;
  const navigate = useNavigate();

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await quranApi.getSurahs();
        setSurahs(data);
      } catch (error) {
        console.error("Error loading surahs:", error);
      } finally {
        setLoading(false);
      }
    };
    loadSurahs();
  }, []);

  const totalPages = Math.ceil(surahs.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentSurahs = surahs.slice(startIndex, endIndex);

  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(itemsPerPage)].map((_, i) => (
          <div key={i} className="p-6 bg-gray-200 dark:bg-gray-800/50 rounded-2xl animate-pulse">
            <div className="flex items-center mb-4 space-x-4">
              <div className="w-12 h-12 bg-gray-300 dark:bg-gray-700 rounded-md"></div>
              <div className="flex-1 space-y-2">
                <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
                <div className="w-20 h-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
              </div>
            </div>
            <div className="w-16 h-3 mt-2 bg-gray-300 dark:bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          All Chapters
        </h2>
        <span className="text-sm text-gray-600 dark:text-[#737373]">114 Surahs</span>
      </motion.div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentSurahs.map((surah, index) => (
          <motion.div
            key={surah.number}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => navigate(`/surah/${surah.number}`)}
            className="relative p-6 transition-all duration-300 bg-white dark:bg-[#0A0A0A] border border-gray-200 dark:border-gray-800 shadow-md cursor-pointer rounded-2xl hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
            >
            <div className="flex items-start justify-between">
              {/* Left side: number + titles */}
              <div className="flex items-center">
                {/* Diamond number */}
                <div className="flex items-center justify-center w-12 h-12 mr-3 rotate-45 rounded-md shadow bg-gray-700 dark:bg-[#343a40]">
                  <span className="font-bold text-white dark:text-white -rotate-45">
                    {surah.number}
                  </span>
                </div>

                {/* Titles */}
                <div className="flex flex-col">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                    {surah.name}
                  </h3>
                  <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                    {surah.englishName}
                  </span>
                  <span className="text-xs text-gray-600 dark:text-gray-400 truncate">
                    {surah.englishNameTranslation}
                  </span>
                </div>
              </div>

              {/* Right badge: revelationType */}
              <div className="self-start">
                <span className="inline-flex items-center rounded-full border border-transparent px-2.5 py-0.5 text-xs font-semibold text-white dark:text-gray-200 bg-gray-600 dark:bg-gray-700 transition-colors hover:bg-gray-700 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"

                >
                  {surah.revelationType}
                </span>
                {/* Bottom: number of ayahs */}
                <div className="mt-4 text-sm font-medium text-gray-600 dark:text-gray-400">
                  {surah.numberOfAyahs} verses
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {surahs.length > itemsPerPage && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-12"
        >
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            itemsPerPage={itemsPerPage}
            totalItems={surahs.length}
          />
        </motion.div>
      )}

      {/* Empty State */}
      {currentSurahs.length === 0 && !loading && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="py-20 text-center"
        >
          <div className="max-w-md mx-auto">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 text-gray-500 dark:text-gray-600 bg-gray-200 dark:bg-gray-800 rounded-full"></div>
            <h3 className="mb-2 text-xl font-semibold text-gray-700 dark:text-gray-300">
              No chapters found
            </h3>
            <p className="text-gray-600 dark:text-gray-500">Try adjusting your filters</p>
          </div>
        </motion.div>
      )}
    </div>
  );
};
