
import { supabase } from "./supabase";

import { getUserProfile } from "./authService";

import store from "../app/store";

import {
  setCurrentUser,
  setAuthLoading,
  setAuthError,
  logoutUser,
} from "../features/auth/authSlice";

let authVersion = 0;

export const initializeAuth = () => {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange(
    (event, session) => {
      const version = ++authVersion;

      // Avoid awaiting Supabase requests directly
      // inside the auth state change callback.
      setTimeout(async () => {
        if (version !== authVersion) return;

        if (!session?.user) {
          store.dispatch(logoutUser());
          return;
        }

        store.dispatch(setAuthLoading(true));

        try {
          const profile = await getUserProfile(
            session.user.id
          );

          if (version !== authVersion) return;

          if (profile.isBlocked) {
            await supabase.auth.signOut();

            if (version !== authVersion) return;

            store.dispatch(logoutUser());
            return;
          }

          store.dispatch(setCurrentUser(profile));
        } catch (error) {
          if (version !== authVersion) return;

          console.error(
            "Unable to restore authentication:",
            error
          );

          store.dispatch(
            setAuthError(error.message)
          );
        }
      }, 0);
    }
  );

  return () => {
    authVersion++;
    subscription.unsubscribe();
  };
};