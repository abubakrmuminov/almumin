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

  if (bookmarks.length === 0) {
    return (
      <main className="flex items-center justify-center min-h-screen pb-20 bg-black">
        <div className="container relative px-4 py-8 mx-auto text-center">
          {/* Орнамент */}
          <div className="absolute inset-0 bg-[url('/ornament.svg')] opacity-10 pointer-events-none"></div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="relative z-10 flex flex-col items-center py-20"
          >
            <Bookmark className="w-20 h-20 mb-6 text-yellow-400" />

            <h1 className="mb-4 text-3xl font-bold text-yellow-400">
              Bookmarks
            </h1>
            <p className="max-w-md mx-auto mb-8 text-gray-400">
              You haven't saved any verses yet. Start reading the Quran and bookmark your favorite verses.
            </p>

            <a
              href="/"
              className="inline-flex items-center justify-center h-10 px-4 py-2 text-sm font-medium text-black transition-colors bg-yellow-400 rounded-md whitespace-nowrap hover:bg-yellow-300"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Start Reading
            </a>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen pt-16 bg-black">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl p-4 mx-auto sm:p-6"
      >
        {/* Header */}
        <div className="flex flex-col items-start justify-between mb-8 space-y-4 sm:flex-row sm:items-center sm:space-y-0">
          <div>
            <h2 className="flex items-center text-3xl font-bold text-yellow-400 sm:text-4xl">
              <Bookmark className="w-8 h-8 mr-3" />
              Bookmarks
            </h2>
            <p className="mt-2 text-gray-400">{bookmarks.length} saved verses</p>
          </div>

          {bookmarks.length > 0 && (
            <motion.button
              onClick={() => setConfirmOpen(true)}
              className="flex items-center px-4 py-2 space-x-2 text-red-400 transition-all duration-300 rounded-lg hover:text-red-300 hover:bg-red-500/10"
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
              className="relative overflow-hidden transition-all duration-500 bg-black border border-gray-800 rounded-xl hover:border-yellow-500/40"
            >
              {/* Орнамент */}
              <div className="absolute inset-0 pointer-events-none bg-[url('/ornament.svg')] opacity-10 rounded-xl"></div>

              {/* Accent line */}
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600"></div>

              <div className="relative z-10 p-6 sm:p-8">
                <div className="flex flex-col items-start justify-between space-y-4 sm:flex-row sm:items-center sm:space-y-0">
                  <div className="flex items-start space-x-4">
                    <div className="flex items-center justify-center w-12 h-12 rounded-md bg-gradient-to-br from-yellow-500 to-yellow-600">
                      <Bookmark className="w-6 h-6 text-black fill-current" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="mb-1 text-xl font-bold text-white">
                        {bookmark.surahName}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
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
                      className="flex items-center px-4 py-2 space-x-2 text-yellow-400 transition-all duration-300 rounded-lg hover:text-yellow-300 hover:bg-yellow-500/10"
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
                      className="p-2 text-red-400 transition-all duration-300 rounded-lg hover:text-red-300 hover:bg-red-500/10"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>

                {/* Arabic text */}
                <div className="mt-6 mb-4 text-right">
                  <p className="leading-loose text-gray-100 font-arabic">
                    {bookmark.text}
                  </p>
                </div>

                {/* Translation */}
                {bookmark.translation && (
                  <div className="pt-4 border-t border-gray-800/70">
                    <p className="leading-relaxed text-gray-300">
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
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative w-full max-w-sm p-6 text-center bg-black border border-gray-800 shadow-lg rounded-xl"
            >
              {/* Орнамент */}
              <div className="absolute inset-0 pointer-events-none bg-[url('/ornament.svg')] opacity-10 rounded-xl"></div>

              <h3 className="relative z-10 mb-4 text-xl font-bold text-yellow-400">
                Clear All Bookmarks?
              </h3>
              <p className="relative z-10 mb-6 text-gray-400">
                This action cannot be undone.
              </p>
              <div className="relative z-10 flex justify-center space-x-4">
                <button
                  onClick={() => setConfirmOpen(false)}
                  className="px-4 py-2 text-gray-300 transition bg-gray-800 rounded-lg hover:bg-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={clearAllBookmarks}
                  className="px-4 py-2 text-black transition bg-yellow-400 rounded-lg hover:bg-yellow-300"
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
