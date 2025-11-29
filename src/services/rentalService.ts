import { apiClient } from "./apiClient";
import { type Rental } from "../types";

export const rentalService = {
  getAll: () => apiClient<Rental[]>("/rentals"),
  getById: (id: number) => apiClient<Rental>(`/rentals/${id}`),
};
