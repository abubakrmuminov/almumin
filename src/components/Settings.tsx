import React, { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Globe, Type, Volume2, Palette, RotateCcw, X, Sun, Moon } from "lucide-react";
import type { Settings as SettingsType } from "../types/quran";

interface SettingsProps {
  settings: SettingsType;
  onSettingsChange: (settings: SettingsType) => void;
}

export const Settings: React.FC<SettingsProps> = ({
  settings,
  onSettingsChange,
}) => {
  const handleSettingChange = (key: keyof SettingsType, value: any) => {
    onSettingsChange({
      ...settings,
      [key]: value,
    });
  };

  const [showModal, setShowModal] = useState(false);

  const translations = [
    { id: "en.asad", name: "Muhammad Asad", language: "English" },
    { id: "en.pickthall", name: "Pickthall", language: "English" },
    { id: "ru.kuliev", name: "Кулиев", language: "Russian" },
    { id: "uz.sodik", name: "Мухаммад Содик Мухаммад Юсуф", language: "Uzbek" },
  ];

  const reciters = [
    { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
    { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
    { id: "ar.sudais", name: "Abdul Rahman As-Sudais" },
    { id: "ar.dossari", name: "Yasser Ad-Dossari" },
  ];

  const fontSizes: {
    id: "small" | "medium" | "large";
    name: string;
    value: number;
  }[] = [
    { id: "small", name: "Small", value: 18 },
    { id: "medium", name: "Medium", value: 24 },
    { id: "large", name: "Large", value: 32 },
  ];

  const themes = [
    { id: "light", name: "Light", icon: <Sun className="w-5 h-5" /> },
    { id: "dark", name: "Dark", icon: <Moon className="w-5 h-5" /> },
  ];

  const resetToDefaults = () => {
    onSettingsChange({
      translation: "en.asad",
      reciter: "ar.alafasy",
      fontSize: "medium",
      fontSizeValue: defaultFontSize["medium"],
      theme: "dark",
    });
    setShowModal(false);
  };

  const defaultFontSize: Record<"small" | "medium" | "large", number> = {
    small: 18,
    medium: 24,
    large: 32,
  };

  return (
    <div className="min-h-screen px-4 pt-20 pb-12 bg-black sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 text-center"
        >
          <h1 className="mb-2 text-4xl font-bold text-white">Settings</h1>
          <p className="text-gray-400">Customize your reading experience</p>
        </motion.div>

        <div className="grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 border border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-xl"
          >
            <h2 className="flex items-center mb-4 text-xl font-bold text-white">
              <Globe className="w-6 h-6 mr-3 text-gray-300" />
              Translation
            </h2>
            <div className="space-y-2">
              {translations.map((tItem) => {
                const active = settings.translation === tItem.id;
                return (
                  <motion.label
                    key={tItem.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-between cursor-pointer px-4 py-3 transition-all duration-300 ${
                      active
                        ? "bg-gray-800 border-2 border-gray-300 text-white"
                        : "bg-gray-900/50 border-2 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                    }`}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <input
                      type="radio"
                      name="translation"
                      value={tItem.id}
                      checked={active}
                      onChange={() =>
                        handleSettingChange("translation", tItem.id)
                      }
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
                          active
                            ? "border-gray-300 bg-gray-300"
                            : "border-gray-600"
                        }`}
                        style={{ borderRadius: "0.25rem" }}
                      >
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-black"
                          ></motion.div>
                        )}
                      </div>
                      <div>
                        <span className="block font-semibold">
                          {tItem.name}
                        </span>
                        <span className="text-xs text-gray-500">
                          {tItem.language}
                        </span>
                      </div>
                    </div>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 border border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-xl"
          >
            <h2 className="flex items-center mb-4 text-xl font-bold text-white">
              <Volume2 className="w-6 h-6 mr-3 text-gray-300" />
              Reciter
            </h2>
            <div className="space-y-2">
              {reciters.map((rItem) => {
                const active = settings.reciter === rItem.id;
                return (
                  <motion.label
                    key={rItem.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center cursor-pointer px-4 py-3 transition-all duration-300 ${
                      active
                        ? "bg-gray-800 border-2 border-gray-300 text-white"
                        : "bg-gray-900/50 border-2 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                    }`}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <input
                      type="radio"
                      name="reciter"
                      value={rItem.id}
                      checked={active}
                      onChange={() => handleSettingChange("reciter", rItem.id)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-5 h-5 border-2 flex items-center justify-center transition-all ${
                          active
                            ? "border-gray-300 bg-gray-300"
                            : "border-gray-600"
                        }`}
                        style={{ borderRadius: "0.25rem" }}
                      >
                        {active && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-3 h-3 bg-black"
                          ></motion.div>
                        )}
                      </div>
                      <span className="font-semibold">{rItem.name}</span>
                    </div>
                  </motion.label>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-6 border border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-xl"
          >
            <h2 className="flex items-center mb-4 text-xl font-bold text-white">
              <Type className="w-6 h-6 mr-3 text-gray-300" />
              Font Size
            </h2>
            <div className="flex gap-3">
              {fontSizes.map((fItem) => {
                const active = settings.fontSize === fItem.id;
                return (
                  <motion.button
                    key={fItem.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        fontSize: fItem.id,
                        fontSizeValue: fItem.value,
                      })
                    }
                    className={`flex-1 px-4 py-3 font-semibold transition-all duration-300 border-2 ${
                      active
                        ? "bg-gray-800 border-gray-300 text-white"
                        : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                    }`}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <div className="text-center">
                      <div className="text-lg">{fItem.name}</div>
                      <div className="text-xs text-gray-500">
                        {fItem.value}px
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="p-6 border border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-xl"
          >
            <h2 className="flex items-center mb-4 text-xl font-bold text-white">
              <Palette className="w-6 h-6 mr-3 text-gray-300" />
              Theme
            </h2>
            <div className="flex gap-3">
              {themes.map((themeItem) => {
                const active = settings.theme === themeItem.id;
                return (
                  <motion.button
                    key={themeItem.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleSettingChange("theme", themeItem.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 font-semibold transition-all duration-300 border-2 ${
                      active
                        ? "bg-gray-800 border-gray-300 text-white"
                        : "bg-gray-900/50 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-white"
                    }`}
                    style={{ borderRadius: "0.5rem" }}
                  >
                    <span className="text-xl">{themeItem.icon}</span>
                    <span>{themeItem.name}</span>
                  </motion.button>
                );
              })}
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-8 mt-8 text-center border border-gray-800 bg-gradient-to-br from-gray-900 to-black rounded-xl"
        >
          <p className="mb-2 text-sm font-semibold tracking-wider text-gray-400 uppercase">
            Preview
          </p>
          <p
            style={{ fontSize: `${settings.fontSizeValue}px` }}
            className="mb-4 text-white font-arabic"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="text-sm text-gray-400">
            In the name of Allah, the Beneficent, the Merciful
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center pt-6"
        >
          <motion.button
            onClick={() => setShowModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 px-6 py-3 font-semibold text-gray-300 transition-all duration-300 border-2 border-gray-600 rounded hover:bg-gray-800 hover:border-gray-500"
          >
            <RotateCcw className="w-5 h-5" />
            Reset to Defaults
          </motion.button>
        </motion.div>
      </div>
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="w-11/12 max-w-md p-6 bg-gray-900 border border-gray-600 rounded-xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-300">
                  Confirm Reset
                </h3>
                <button onClick={() => setShowModal(false)}>
                  <X className="w-5 h-5 text-gray-400 hover:text-gray-300" />
                </button>
              </div>
              <p className="mb-6 text-gray-400">
                Are you sure you want to reset all settings to default?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 font-semibold text-gray-400 border border-gray-600 rounded hover:bg-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={resetToDefaults}
                  className="px-4 py-2 font-semibold text-gray-300 bg-gray-700 rounded hover:bg-gray-600"
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
