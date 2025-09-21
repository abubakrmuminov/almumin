import { motion } from "framer-motion";

export const SurahSkeleton = () => {
  return (
    <div className="max-w-3xl p-6 pt-20 mx-auto space-y-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 sm:p-8 rounded-3xl glass animate-pulse"
        >
          {/* Ayah number placeholder */}
          <div className="w-10 h-10 mb-4 rounded-xl bg-gray-700/40"></div>
          {/* Arabic text placeholder */}
          <div className="w-full h-6 mb-3 rounded bg-gray-700/30"></div>
          <div className="w-full h-6 mb-3 rounded bg-gray-700/30"></div>
          <div className="w-3/4 h-6 mb-3 rounded bg-gray-700/30"></div>
          {/* Translation placeholder */}
          <div className="w-full h-4 mt-4 rounded bg-gray-700/20"></div>
          <div className="w-5/6 h-4 mt-2 rounded bg-gray-700/20"></div>
        </motion.div>
      ))}
    </div>
  );
};
