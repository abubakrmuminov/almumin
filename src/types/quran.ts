export interface Surah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  manzil: number;
  page: number;
  ruku: number;
  hizbQuarter: number;
  sajda: boolean;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
  ayahs: Ayah[];
}

export interface Translation {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  type: string;
}

export interface Bookmark {
  surahNumber: number;
  surahName: string;
  ayahNumber: number;
  text: string;
  translation: string;
}

export interface Settings {
  translation: string;
  reciter: string;
  fontSize: "small" | "medium" | "large"; // кнопка
  fontSizeValue: number; // для preview и slider
  theme: "light" | "dark";
}

// types/quran.ts
export interface LastRead {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  timestamp: number;
  text: string; // добавляем текст аята
  date?: string;
}
