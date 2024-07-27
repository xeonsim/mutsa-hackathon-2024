"use client";
import { AuthProvider } from "@/context/authProvider";

export default function RootLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
