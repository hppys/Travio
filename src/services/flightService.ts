import { apiClient } from "./apiClient";
import { type Flight } from "../types";

export const flightService = {
  getAll: () => apiClient<Flight[]>("/flights"),
  getById: (id: number) => apiClient<Flight>(`/flights/${id}`),
};
