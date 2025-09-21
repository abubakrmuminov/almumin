const BASE_URL = 'https://api.alquran.cloud/v1';

export const quranApi = {
  // Get all surahs
  getSurahs: async () => {
    try {
      const response = await fetch(`${BASE_URL}/surah`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching surahs:', error);
      throw error;
    }
  },

  // Get specific surah with Arabic text
  getSurah: async (surahNumber: number) => {
    try {
      const response = await fetch(`${BASE_URL}/surah/${surahNumber}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching surah:', error);
      throw error;
    }
  },

  // Get surah with translation
  getSurahWithTranslation: async (surahNumber: number, translation: string = 'en.asad') => {
    try {
      const response = await fetch(`${BASE_URL}/surah/${surahNumber}/${translation}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching surah with translation:', error);
      throw error;
    }
  },

  // Get specific ayah with translation
  getAyahWithTranslation: async (surahNumber: number, ayahNumber: number, translation: string = 'en.asad') => {
    try {
      const response = await fetch(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${translation}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching ayah:', error);
      throw error;
    }
  },

  // Get audio for ayah
  getAyahAudio: async (surahNumber: number, ayahNumber: number, reciter: string = 'ar.alafasy') => {
    try {
      const response = await fetch(`${BASE_URL}/ayah/${surahNumber}:${ayahNumber}/${reciter}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error fetching audio:', error);
      throw error;
    }
  },

  // Search ayahs
  searchAyahs: async (query: string, translation: string = 'en.asad') => {
    try {
      const response = await fetch(`${BASE_URL}/search/${query}/all/${translation}`);
      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error('Error searching ayahs:', error);
      throw error;
    }
  }
};