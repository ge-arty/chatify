import { create } from "zustand";

interface IAuthStore {
  authUser: {
    name: string;
    _id: string;
    age: string;
  };

  isLogged: boolean;
  isLoading: boolean;
  login: () => void;
}

export const useAuthStore = create<IAuthStore>((set, get) => ({
  authUser: { name: "John", _id: "123", age: "25" },
  isLoading: false,
  isLogged: false,

  login: (): void => {
    set({ isLogged: true, isLoading: true });
  },
}));
