// app/AuthProvider.js
"use client";

import React, { useState, useEffect, createContext, useContext } from "react";
import { getAuth } from "firebase/auth";
import { usePathname, useRouter } from "next/navigation";
import nookies from "nookies";

const AuthContext = createContext({ user: null });

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    const auth = getAuth();
    return auth.onIdTokenChanged(async (user) => {
      if (!user) {
        setUser(null);
        nookies.destroy(null, "token");
        nookies.set(null, "token", "", { path: "/" });
      } else {
        const token = await user.getIdToken();
        setUser(user);
        nookies.set(null, "token", token, { path: "/" });
        if (path.startsWith("/admin")) {
          if (user.email != process.env.NEXT_PUBLIC_APP_EMAIL) {
            router.replace("/");
          }
        }
      }
    });
  }, [router, path]);

  useEffect(() => {
    const handle = setInterval(async () => {
      const user = getAuth().currentUser;
      if (user) await user.getIdToken(true);
    }, 10 * 60 * 1000);

    return () => clearInterval(handle);
  }, []);

  return (
    <AuthContext.Provider value={{ user }}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
