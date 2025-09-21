import React from "react";
import { motion } from "framer-motion";
import { Globe, Type, Volume2, Palette, RotateCcw } from "lucide-react";
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

  const translations = [
    { id: "en.asad", name: "Muhammad Asad", language: "English" },
    { id: "en.pickthall", name: "Pickthall", language: "English" },
    { id: "ru.kuliev", name: "Кулиев", language: "Russian" },
    { id: "ru.porokhova", name: "Порохова", language: "Russian" },
  ];

  const reciters = [
    { id: "ar.alafasy", name: "Mishary Rashid Alafasy" },
    { id: "ar.husary", name: "Mahmoud Khalil Al-Husary" },
    { id: "ar.sudais", name: "Abdul Rahman As-Sudais" },
  ];

  const fontSizes = [
    { id: "small", name: "Small", value: 18 },
    { id: "medium", name: "Medium", value: 24 },
    { id: "large", name: "Large", value: 32 },
  ];

  const themes = [
    { id: "light", name: "Light", icon: "☀️" },
    { id: "dark", name: "Dark", icon: "🌙" },
  ];

  const defaultFontSize: Record<"small" | "medium" | "large", number> = {
    small: 18,
    medium: 24,
    large: 32,
  };

  return (
    <div className="min-h-screen px-4 pt-16 space-y-12 sm:px-6 lg:px-8">
      <div className="space-y-8">
        {/* Первый ряд: Translation + Reciter */}
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Translation */}
          <div className="flex-1 space-y-2">
            <h2 className="flex items-center text-xl font-bold text-white">
              <Globe className="w-5 h-5 mr-2" />
              Translation
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {translations.map((tItem) => {
                const active = settings.translation === tItem.id;
                return (
                  <label
                    key={tItem.id}
                    className={`cursor-pointer rounded-2xl p-3 transition-all duration-300 ${
                      active
                        ? "ring-2 ring-blue-500/50 bg-white/10"
                        : "glass hover:bg-white/5"
                    }`}
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
                    <div className="flex items-center space-x-2">
                      <div
                        className={`w-4 h-4 border-2 rounded-full flex items-center justify-center ${
                          active
                            ? "border-blue-500 bg-blue-500"
                            : "border-gray-500"
                        }`}
                      >
                        {active && (
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        )}
                      </div>
                      <span className="font-medium text-white">
                        {tItem.name}
                      </span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Reciter */}
          <div className="flex-1 space-y-2">
            <h2 className="flex items-center text-xl font-bold text-white">
              <Volume2 className="w-5 h-5 mr-2" />
              Reciter
            </h2>
            <div className="grid grid-cols-1 gap-2">
              {reciters.map((rItem) => {
                const active = settings.reciter === rItem.id;
                return (
                  <label
                    key={rItem.id}
                    className={`cursor-pointer rounded-2xl p-3 transition-all duration-300 ${
                      active
                        ? "ring-2 ring-blue-500/50 bg-white/10"
                        : "glass hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name="reciter"
                      value={rItem.id}
                      checked={active}
                      onChange={() => handleSettingChange("reciter", rItem.id)}
                      className="sr-only"
                    />
                    <span className="font-medium text-white">{rItem.name}</span>
                  </label>
                );
              })}
            </div>
          </div>
        </div>

        {/* Второй ряд: Font Size + Theme */}
        <div className="flex flex-col gap-6 sm:flex-row">
          {/* Font Size */}
          <div className="flex-1 space-y-2">
            <h2 className="flex items-center text-xl font-bold text-white">
              <Type className="w-5 h-5 mr-2" />
              Font Size
            </h2>
            <div className="flex flex-wrap gap-2">
              {fontSizes.map((fItem) => {
                const active = settings.fontSize === fItem.id;
                return (
                  <button
                    key={fItem.id}
                    onClick={() =>
                      onSettingsChange({
                        ...settings,
                        fontSize: fItem.id,
                        fontSizeValue: fItem.value,
                      })
                    }
                    className={`px-4 py-2 rounded-2xl font-medium transition-all duration-300 ${
                      active
                        ? "bg-white/10 ring-2 ring-blue-500/50 text-white"
                        : "glass text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {fItem.name} ({fItem.value}px)
                  </button>
                );
              })}
            </div>
          </div>

          {/* Theme */}
          <div className="flex-1 space-y-2">
            <h2 className="flex items-center text-xl font-bold text-white">
              <Palette className="w-5 h-5 mr-2" />
              Theme
            </h2>
            <div className="flex gap-2">
              {themes.map((themeItem) => {
                const active = settings.theme === themeItem.id;
                return (
                  <button
                    key={themeItem.id}
                    onClick={() => handleSettingChange("theme", themeItem.id)}
                    className={`flex items-center px-4 py-2 gap-2 rounded-2xl font-medium transition-all duration-300 ${
                      active
                        ? "bg-white/10 ring-2 ring-blue-500/50 text-white"
                        : "glass text-gray-300 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span>{themeItem.icon}</span>
                    <span>{themeItem.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="p-4 mt-4 text-center bg-white/10 rounded-xl">
          <p
            style={{ fontSize: `${settings.fontSizeValue}px` }}
            className="text-white font-arabic"
          >
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </p>
          <p className="mt-2 text-sm text-gray-400">
            In the name of Allah, the Beneficent, the Merciful
          </p>
        </div>
      </div>

      {/* Reset */}
      <div className="pt-6 border-t border-white/10">
        <motion.button
          onClick={() => {
            if (window.confirm("Reset all settings to default?")) {
              onSettingsChange({
                translation: "en.asad",
                reciter: "ar.alafasy",
                fontSize: "medium",
                fontSizeValue: defaultFontSize["medium"],
                theme: "dark",
              });
            }
          }}
          className="flex items-center gap-2 px-6 py-3 text-red-400 transition-all duration-300 rounded-xl hover:text-red-300 hover:bg-red-500/10"
          whileHover={{ scale: 1.05, rotate: -5 }}
          whileTap={{ scale: 0.95 }}
        >
          <RotateCcw className="w-5 h-5" />
          Reset to Defaults
        </motion.button>
      </div>
    </div>
  );
};
