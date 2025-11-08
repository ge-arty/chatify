import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";

interface IUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface IAuthStore {
  authUser: null | IUser;
  isCheckingAuth: boolean;
  isSigningUp: boolean;
  checkAuth: () => Promise<void>;
  signup: (data: {
    fullName: string;
    email: string;
    password: string;
  }) => Promise<void>;
}

export const useAuthStore = create<IAuthStore>((set, get) => ({
  authUser: null,
  isCheckingAuth: true,
  isSigningUp: false,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get("/auth/check");
      set({ authUser: res.data });
    } catch (error) {
      console.log("Error in auth check:", error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async (data) => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post("/auth/signup", data);
      set({ authUser: res.data });
      toast.success("Account created successfully!");
    } catch (error) {
      console.log("Error in signup:", error);
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message || "Signup failed");
      } else {
        toast.error("An error occurred during signup");
      }
    } finally {
      set({ isSigningUp: false });
    }
  },
}));
