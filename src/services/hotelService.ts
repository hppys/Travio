import { apiClient } from "./apiClient";
import type { Hotel } from "../types/index.ts";

const CACHE_KEY = "offline_hotels";

export const hotelService = {
  getAll: async () => {
    try {
      const data = await apiClient<Hotel[]>("/hotels");
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn("Offline Mode: Mengambil data hotel dari cache lokal.");
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) return JSON.parse(cachedData) as Hotel[];
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      return await apiClient<Hotel>(`/hotels/${id}`);
    } catch (error) {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const hotels = JSON.parse(cachedData) as Hotel[];
        const found = hotels.find((h) => h.id === id);
        if (found) return found;
      }
      throw error;
    }
  },
};
