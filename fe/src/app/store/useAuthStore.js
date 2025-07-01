import { create } from "zustand";
import { logOut, getMe, loginToBackend, registerToBackend } from "../api/auth";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";

export const useAuthStore = create((set) => ({
  user: null,
  loading: false,
  error: null,

  setUser: (user) => set({ user }),

  register: async (newUser) => {
    try {
      set({ loading: true, error: null });
      await registerToBackend(newUser);
    } catch (error) {
      set({
        error:
          typeof error?.response?.data?.message === "string"
            ? error.response.data.message
            : "Register failed",
      });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  login: async ({ email, password }) => {
    try {
      set({ loading: true, error: null });
      // login firebase
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredentials.user;

      // ambil token dari firebase
      const idToken = await user.getIdToken();

      // login ke backend
      await loginToBackend({ idToken });

      const res = await getMe();

      set({ user: res.data });
    } catch (error) {
      set({ error: error.response?.data?.message || "login failed" });
      throw error;
    } finally {
      set({ loading: false });
    }
  },

  logout: async () => {
    try {
      await logOut();
      set({ user: null });
      window.location.href = "/";
    } catch (error) {
      console.log("logOut error:", error);
      set({ error: error.response?.data?.message || "logout failed" });
    }
  },

  fetchUser: async () => {
    try {
      const res = await getMe();
      set({ user: res.data });
    } catch {
      set({ user: null });
    }
  },
}));
