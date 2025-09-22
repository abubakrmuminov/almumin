import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navigation from "./components/Navigation";
import { Dashboard } from "./components/Dashboard";
import { SurahPage } from "./components/SurahPage";
import { Bookmarks } from "./components/Bookmarks";
import { Settings } from "./components/Settings";
import { useLocalStorage } from "./hooks/useLocalStorage";
import type { Settings as SettingsType } from "./types/quran";
import { Footer } from "./components/Footer";

function App() {
  const [settings, setSettings] = useLocalStorage<SettingsType>("settings", {
    translation: "en.asad",
    reciter: "ar.alafasy",
    fontSize: "medium",
    theme: "dark",
    fontSizeValue: 24, // <--- добавляем
  });

  // применяем тему
  useEffect(() => {
    document.documentElement.classList.toggle(
      "dark",
      settings.theme === "dark"
    );
  }, [settings.theme]);

  const handleToggleTheme = () => {
    setSettings((prev) => ({
      ...prev,
      theme: prev.theme === "dark" ? "light" : "dark",
    }));
  };

  return (
    <div
  className={`flex flex-col min-h-screen transition-colors ${settings.fontSize}`}
>
      <Navigation
        isDark={settings.theme === "dark"}
        onToggleTheme={handleToggleTheme}
      />

      <main className="flex-1">
        <Routes>
          {/* Главная страница */}
          <Route path="/" element={<Dashboard settings={settings} />} />

          {/* Страница конкретной суры */}
          <Route
            path="/surah/:id"
            element={<SurahPage settings={settings} />}
          />

          {/* Закладки */}
          <Route path="/bookmarks" element={<Bookmarks />} />

          {/* Настройки */}
          <Route
            path="/settings"
            element={
              <Settings settings={settings} onSettingsChange={setSettings} />
            }
          />

          {/* fallback, если путь неправильный */}
          <Route
            path="*"
            element={
              <div className="flex flex-col items-center justify-center min-h-screen text-gray-400">
                <p className="mb-4">Страница не найдена</p>
                <a
                  href="/"
                  className="px-4 py-2 text-white bg-gray-700 rounded-lg hover:bg-gray-600"
                >
                  На главную
                </a>
              </div>
            }
          />
        </Routes>
      </main>
      <Footer
        onNavigateHome={function (): void {
          throw new Error("Function not implemented.");
        }}
      ></Footer>
    </div>
  );
}

export default App;
