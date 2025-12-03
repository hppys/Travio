import { apiClient } from "./apiClient";
import { type Rental } from "../types";

const CACHE_KEY = "offline_rentals";

export const rentalService = {
  getAll: async () => {
    try {
      const data = await apiClient<Rental[]>("/rentals");
      localStorage.setItem(CACHE_KEY, JSON.stringify(data));
      return data;
    } catch (error) {
      console.warn("Offline Mode: Mengambil data rental dari cache lokal.");
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) return JSON.parse(cachedData) as Rental[];
      throw error;
    }
  },

  getById: async (id: number) => {
    try {
      return await apiClient<Rental>(`/rentals/${id}`);
    } catch (error) {
      const cachedData = localStorage.getItem(CACHE_KEY);
      if (cachedData) {
        const rentals = JSON.parse(cachedData) as Rental[];
        const found = rentals.find((r) => r.id === id);
        if (found) return found;
      }
      throw error;
    }
  },
};
