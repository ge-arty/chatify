import { create } from "zustand";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { useAuthStore } from "./useAuthStore";

interface IUser {
  _id: string;
  email: string;
  fullName: string;
  profilePic?: string;
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

interface IMessage {
  _id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
  isOptimistic?: boolean;
}

interface IChatStore {
  allContacts: IUser[];
  chats: IUser[];
  messages: IMessage[];
  activeTab: "chats" | "contacts";
  selectedUser: IUser | null;
  isUsersLoading: boolean;
  isMessagesLoading: boolean;
  isSoundEnabled: boolean;
  toggleSound: () => void;
  setActiveTab: (tab: "chats" | "contacts") => void;
  setSelectedUser: (selectedUser: IUser | null) => void;
  getAllContacts: () => Promise<void>;
  getMyChatPartners: () => Promise<void>;
  getMessagesByUserId: (userId: string) => Promise<void>;
  sendMessage: (messageData: { text: string; image: string }) => Promise<void>;
}

export const useChatStore = create<IChatStore>((set, get) => ({
  allContacts: [],
  chats: [],
  messages: [],
  activeTab: "chats",
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  isSoundEnabled: JSON.parse(localStorage.getItem("isSoundEnabled") || "true"),

  toggleSound: () => {
    const newValue = !get().isSoundEnabled;
    localStorage.setItem("isSoundEnabled", JSON.stringify(newValue));
    set({ isSoundEnabled: newValue });
  },

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSelectedUser: (selectedUser) => set({ selectedUser }),

  getAllContacts: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/contacts");
      set({ allContacts: res.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message || "Failed to load contacts");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMyChatPartners: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/chats");
      set({ chats: res.data });
    } catch (error) {
      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message || "Failed to load chats");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessagesByUserId: async (userId) => {
    set({ isMessagesLoading: true });

    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      console.error("Error in getMessagesByUserId:", error);

      if (error instanceof AxiosError && error.response) {
        toast.error(error.response.data.message || "Failed to load messages");
      } else {
        toast.error("An unknown error occurred while fetching messages");
      }
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
    const { authUser } = useAuthStore.getState();

    if (!authUser?._id || !selectedUser?._id) {
      toast.error("User information is missing");
      return;
    }

    const tempId = `temp-${Date.now()}`;

    const optimisticMessage: IMessage = {
      _id: tempId,
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text,
      image: messageData.image,
      createdAt: new Date(),
      isOptimistic: true,
    };

    set({ messages: [...messages, optimisticMessage] });

    try {
      const res = await axiosInstance.post(
        `/messages/send/${selectedUser._id}`,
        messageData
      );

      set({
        messages: messages
          .map((msg) => (msg._id === tempId ? res.data : msg))
          .concat(
            messages.some((msg) => msg._id === res.data._id) ? [] : [res.data]
          ),
      });
    } catch (error: any) {
      // remove optimistic message on failure
      set({ messages: messages.filter((msg) => msg._id !== tempId) });
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  },
}));
