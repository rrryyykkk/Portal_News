/* eslint-disable no-unused-vars */

// app/store/useToastStore.js
import { create } from "zustand";

export const useToastStore = create((set) => ({
  toast: { message: "", type: "" },

  setToast: (payload) =>
    set((state) => {
      if (typeof payload === "string") {
        return { toast: { message: payload, type: "info" } };
      }

      const { message = "", type = "info" } = payload || {};
      return { toast: { message, type } };
    }),

  clearToast: () => set({ toast: { message: "", type: "" } }),
}));
