"use client";
import { AuthProvider } from "@/app/context/authProvider";

export default function RootLayout({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}
