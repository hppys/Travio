import { apiClient } from "./apiClient";
import { type Flight } from "../types";

const CACHE_KEY = "offline_flights";

export const flightService = {
  getAll: async () => {
    try {
      // 1. Coba ambil dari Internet
      const data = await apiClient<Flight[]>("/flights");

      // 2. Jika berhasil, SIMPAN ke LocalStorage (untuk cadangan)
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      // 3. Jika GAGAL (Offline), ambil dari LocalStorage
      console.warn(
        "Offline Mode: Mengambil data penerbangan dari cache lokal."
      );
      const cachedData = localStorage.getItem(CACHE_KEY);

      if (cachedData) {
        return JSON.parse(cachedData) as Flight[];
      }

      // Jika tidak ada cache sama sekali, lempar error
      throw error;
    }
  },

  getById: async (id: number) => {
    // Untuk detail, kita bisa cari dari cache list dulu agar lebih cepat
    try {
      return await apiClient<Flight>(`/flights/${id}`);
    } catch (error) {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const flights = JSON.parse(cachedData) as Flight[];
        const found = flights.find((f) => f.id === id);
        if (found) return found;
      }
      throw error;
    }
  },
};
