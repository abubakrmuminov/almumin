import { motion } from "framer-motion";

export const SurahSkeleton = () => {
  return (
    <div className="max-w-3xl p-6 pt-20 mx-auto space-y-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="p-6 sm:p-8 rounded-xl bg-[#0f0e0e]/70 border border-[#1a1818] shadow-md backdrop-blur-md relative overflow-hidden"
        >
          {/* shimmer эффект */}
          <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/10 to-transparent animate-[shimmer_2s_infinite]" />

          {/* Ayah number placeholder */}
          <div className="w-10 h-10 mb-4 rounded-lg bg-gray-700/40" />
          {/* Arabic text placeholder */}
          <div className="w-full h-6 mb-3 rounded bg-gray-700/30" />
          <div className="w-full h-6 mb-3 rounded bg-gray-700/30" />
          <div className="w-3/4 h-6 mb-3 rounded bg-gray-700/30" />
          {/* Translation placeholder */}
          <div className="w-full h-4 mt-4 rounded bg-gray-700/20" />
          <div className="w-5/6 h-4 mt-2 rounded bg-gray-700/20" />
        </motion.div>
      ))}
    </div>
  );
};