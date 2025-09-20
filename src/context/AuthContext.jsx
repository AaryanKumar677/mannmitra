import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../config/supabaseClient";
import { getProfile } from "../config/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  console.log("🔵 AuthProvider: render start");

  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const refreshProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    setProfileLoading(true);
    try {
      const { profile, error } = await getProfile(userId);
      if (!error && profile) {
        setProfile(profile);
      } else {
        setProfile(null);
      }
    } catch (err) {
      console.error("refreshProfile error:", err.message);
      setProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    console.log("🔵 AuthProvider: useEffect init");

    const init = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const currentUser = session?.user || null;
      console.log("🔵 AuthProvider: session user =", currentUser);
      setUser(currentUser);

      if (currentUser) {
        await refreshProfile(currentUser.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    init();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const newUser = session?.user || null;
         console.log("🔵 AuthProvider: onAuthStateChange ->", _event, newUser);
        setUser(newUser);

        if (newUser) {
          await refreshProfile(newUser.id);
        } else {
          setProfile(null);
        }
      }
    );

    return () => {
      listener?.subscription?.unsubscribe();
    };
  }, []);

  const signUp = async (email, password) => {
    return await supabase.auth.signUp({ email, password });
  };

  const signIn = async (email, password) => {
    return await supabase.auth.signInWithPassword({ email, password });
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        profileLoading,
        refreshProfile,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};


export const useAuth = () => {
  const ctx = useContext(AuthContext);
  console.log("🟢 useAuth() ->", ctx);
  return ctx;
};

