import { create } from "zustand";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/supabase-client";

type AuthStore = {
  user: User | null;
  signInWithGithub: () => void;
  signOut: () => void;
};

export const useAuthStore = create<AuthStore>()((set) => ({
  user: null,
  signInWithGithub: () => supabase.auth.signInWithOAuth({ provider: "google" }),
  signOut: async () => {
    await supabase.auth.signOut();
    set({user: null})
  },
}));
