import React from "react";
import { Instagram, Send, MessageCircle } from "lucide-react";
import { motion } from "framer-motion";

interface FooterProps {
  onNavigateHome: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateHome }) => {
  return (
    <footer className="w-full mt-8 bg-[#0A0A0A]/80 backdrop-blur-md border-t border-gray-800">
    <div className="flex flex-col items-center justify-between px-6 py-4 mx-auto space-y-4 max-w-7xl sm:flex-row sm:space-y-0">
      {/* Logo */}
      <motion.div
        className="flex items-center space-x-3 cursor-pointer"
        onClick={onNavigateHome}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="flex items-center justify-center w-10 h-10 rounded-xl bg-[#343a40] shadow-md"
          whileHover={{ rotate: 10 }}
        >
          <span className="text-lg font-bold text-white">م</span>
        </motion.div>
        <motion.span
          className="text-lg font-bold text-white"
          whileHover={{ x: 3 }}
        >
          AlMumin
        </motion.span>
      </motion.div>
  
      {/* Social links */}
      <div className="flex items-center space-x-6">
        {[
          { href: "https://instagram.com/secretly_ai", icon: Instagram },
          { href: "https://t.me/abubakr_ai", icon: Send },
          { href: "https://t.me/nur_al_mumin", icon: MessageCircle },
        ].map(({ href, icon: Icon }) => (
          <motion.a
            key={href}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 transition-colors hover:text-white"
            whileHover={{ scale: 1.2 }}
          >
            <Icon className="w-5 h-5" />
          </motion.a>
        ))}
      </div>
    </div>
  </footer>
  
  );
};
