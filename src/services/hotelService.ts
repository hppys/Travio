import { apiClient } from "./apiClient";
import { type Hotel } from "../types";

export const hotelService = {
  getAll: () => apiClient<Hotel[]>("/hotels"),
  getById: (id: number) => apiClient<Hotel>(`/hotels/${id}`),
};
