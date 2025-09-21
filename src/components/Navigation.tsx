import React, { useState } from "react";
import {
  Settings as SettingsIcon,
  Moon,
  Sun,
  Menu,
  X,
  Home,
  Bookmark,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { NavLink, useNavigate } from "react-router-dom";

interface NavigationProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

const Navigation: React.FC<NavigationProps> = ({ isDark, onToggleTheme }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const navItems = [
    { to: "/", label: "Home", icon: Home },
    { to: "/bookmarks", label: "Bookmarks", icon: Bookmark },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/50 backdrop-blur-md">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <motion.div
            className="flex items-center space-x-3 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            onClick={() => navigate("/")}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-gray-700 rounded-xl">
              <span className="text-lg font-bold text-white">م</span>
            </div>
            <h1 className="text-xl font-bold text-white">AlMumin</h1>
          </motion.div>

          {/* Desktop Navigation */}
          <div className="items-center hidden space-x-1 md:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `relative px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center space-x-2 ${
                      isActive
                        ? "text-white bg-white/10"
                        : "text-gray-300 hover:text-white hover:bg-white/5"
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="items-center hidden space-x-2 md:flex">
            <motion.button
              onClick={onToggleTheme}
              className="p-2.5 text-gray-300 transition-all duration-300 rounded-xl hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </motion.button>

            <motion.button
              onClick={() => navigate("/settings")}
              className="p-2.5 text-gray-300 transition-all duration-300 rounded-xl hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
            >
              <SettingsIcon className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-300 transition-colors rounded-xl hover:text-white hover:bg-white/10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </motion.button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-white/10 bg-black/50 backdrop-blur-md md:hidden"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-left transition-all duration-300 ${
                        isActive
                          ? "text-white bg-white/10"
                          : "text-gray-300 hover:text-white hover:bg-white/5"
                      }`
                    }
                    onClick={() => setIsOpen(false)}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </NavLink>
                );
              })}

              <div className="pt-2 mt-4 border-t border-white/10">
                <motion.button
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                  onClick={() => {
                    onToggleTheme();
                    setIsOpen(false);
                  }}
                  className="flex items-center w-full px-4 py-3 space-x-3 text-gray-300 transition-all duration-300 rounded-xl hover:text-white hover:bg-white/5"
                >
                  {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                  <span className="font-medium">Toggle Theme</span>
                </motion.button>

                <NavLink
                  to="/settings"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center w-full px-4 py-3 space-x-3 text-gray-300 transition-all duration-300 rounded-xl hover:text-white hover:bg-white/5"
                >
                  <SettingsIcon className="w-5 h-5" />
                  <span className="font-medium">Settings</span>
                </NavLink>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navigation;
