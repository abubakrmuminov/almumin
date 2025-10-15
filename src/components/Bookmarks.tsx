import React, { useState } from "react";
import { Bookmark, Trash2, BookOpen, ArrowRight, Hash } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import type { Bookmark as BookmarkType } from "../types/quran";

export const Bookmarks: React.FC = () => {
  const [bookmarks, setBookmarks] = useLocalStorage<BookmarkType[]>(
    "bookmarks",
    []
  );
  const [confirmOpen, setConfirmOpen] = useState(false);
  const navigate = useNavigate();

  const removeBookmark = (surahNumber: number, ayahNumber: number) => {
    setBookmarks((prev) =>
      prev.filter(
        (b) => !(b.surahNumber === surahNumber && b.ayahNumber === ayahNumber)
      )
    );
  };

  const clearAllBookmarks = () => {
    setBookmarks([]);
    setConfirmOpen(false);
  };

  // --- EMPTY STATE ---
  if (bookmarks.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen pb-20 transition-colors duration-300 bg-white dark:bg-black">
        <div className="container relative px-4 py-8 mx-auto text-center">
          <div className="absolute inset-0 bg-[url('/ornament.svg')] opacity-10 pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative z-10 flex flex-col items-center py-20"
          >
            <Bookmark className="w-20 h-20 mb-6 text-gray-400 dark:text-gray-300" />
            <h1 className="mb-4 text-3xl font-bold text-gray-900 dark:text-gray-200">
              Bookmarks
            </h1>
            <p className="max-w-md mx-auto mb-8 text-gray-600 dark:text-gray-400">
              You haven't saved any verses yet. Start reading the Quran and bookmark your favorite verses.
            </p>

            <a
              href="/"
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-white transition-colors bg-gray-900 rounded-md hover:bg-gray-800 dark:text-black dark:bg-gray-300 dark:hover:bg-gray-400"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start Reading
            </a>
          </motion.div>
        </div>
      </main>
    );
  }

  // --- MAIN LIST ---
  return (
    <div className="min-h-screen pt-16 transition-colors duration-300 bg-white dark:bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl p-4 mx-auto sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-col items-start justify-between mb-8 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h2 className="flex items-center text-3xl font-bold text-gray-900 dark:text-gray-200 sm:text-4xl">
              <Bookmark className="w-8 h-8 mr-3" />
              Bookmarks
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              {bookmarks.length} saved verses
            </p>
          </div>

          {bookmarks.length > 0 && (
            <motion.button
              onClick={() => setConfirmOpen(true)}
              className="flex items-center px-4 py-2 space-x-2 text-red-600 transition-all duration-300 rounded-lg dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Trash2 className="w-4 h-4" />
              <span>Clear All</span>
            </motion.button>
          )}
        </div>

        {/* Bookmarks List */}
        <div className="space-y-6">
          {bookmarks.map((bookmark, index) => (
            <motion.div
              key={`${bookmark.surahNumber}-${bookmark.ayahNumber}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: index * 0.05,
                duration: 0.5,
                type: "spring",
                bounce: 0.3,
              }}
              className="relative overflow-hidden transition-all duration-500 bg-white border border-gray-200 dark:bg-black dark:border-gray-800 rounded-xl hover:border-gray-400/40"
            >
              <div className="absolute inset-0 pointer-events-none bg-[url('/ornament.svg')] opacity-10 rounded-xl"></div>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500"></div>

              <div className="relative z-10 p-6 sm:p-8">
                <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-700">
                      <Bookmark className="w-6 h-6 text-black fill-current dark:text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-xl font-bold text-gray-900 dark:text-gray-100">
                        {bookmark.surahName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Hash className="w-3 h-3" />
                        <span>Verse {bookmark.ayahNumber}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() =>
                        navigate(`/surah/${bookmark.surahNumber}`, {
                          state: {
                            fromBookmark: true,
                            ayahNumber: bookmark.ayahNumber,
                          },
                        })
                      }
                      className="flex items-center px-4 py-2 space-x-2 text-gray-700 transition-all duration-300 rounded-lg dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-500/10"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Read</span>
                      <ArrowRight className="w-4 h-4" />
                    </motion.button>

                    <motion.button
                      onClick={() =>
                        removeBookmark(bookmark.surahNumber, bookmark.ayahNumber)
                      }
                      className="p-2 text-red-600 transition-all duration-300 rounded-lg dark:text-red-400 hover:text-red-400 dark:hover:text-red-300 hover:bg-red-100 dark:hover:bg-red-500/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Arabic text */}
                <div className="mt-6 mb-4 text-right">
                  <p className="leading-loose text-gray-800 dark:text-gray-100 font-arabic">
                    {bookmark.text}
                  </p>
                </div>

                {/* Translation */}
                {bookmark.translation && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-800">
                    <p className="leading-relaxed text-gray-700 dark:text-gray-300">
                      {bookmark.translation}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Confirm Modal */}
      <AnimatePresence>
        {confirmOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 dark:bg-black/80"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-sm p-6 text-center bg-white border border-gray-200 shadow-lg dark:bg-black dark:border-gray-800 rounded-xl"
            >
              <div className="absolute inset-0 pointer-events-none bg-[url('/ornament.svg')] opacity-10 rounded-xl"></div>

              <h3 className="relative z-10 mb-4 text-xl font-bold text-gray-900 dark:text-gray-200">
                Clear All Bookmarks?
              </h3>
              <p className="relative z-10 mb-6 text-gray-600 dark:text-gray-400">
                This action cannot be undone.
              </p>
              <div className="relative z-10 flex justify-center space-x-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 text-gray-700 transition bg-gray-200 rounded-lg dark:text-gray-300 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllBookmarks}
                  className="px-4 py-2 text-white transition bg-red-600 rounded-lg hover:bg-red-500 dark:bg-gray-300 dark:text-black dark:hover:bg-gray-400"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
