"use client";

import { auth, db } from "@/firebase/firebaseClient";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    phone: "",
    deposit: 0,
  });

  useEffect(() => {
    setTimeout(() => {
      const userAuth = auth.currentUser;
      if (userAuth) {
        const ref = doc(db, "users", userAuth.uid);
        getDoc(ref).then((res) => {
          setUserData(res.data());
        });
      } else {
        router.push("/");
      }
    }, 1000);
  }, [router]);

  return (
    <div className="min-h-screen bg-secondary-100 py-layout flex items-center justify-center">
      <div className="container mx-auto px-layout max-w-2xl">
        <div className="bg-white shadow-md rounded-layout p-12 mb-layout relative">
          <h2 className="text-3xl font-bold text-secondary-700 mb-8 text-center">
            내 프로필
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold text-secondary-700 mb-2">
                닉네임
              </h3>
              <p className="text-secondary-500 text-lg">{userData.name}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary-700 mb-2">
                이메일
              </h3>
              <p className="text-secondary-500 text-lg">{userData.email}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary-700 mb-2">
                전화번호
              </h3>
              <p className="text-secondary-500 text-lg">{userData.phone}</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-secondary-700 mb-2">
                보증금
              </h3>
              <p className="text-secondary-500 text-lg">
                {userData.deposit.toLocaleString()}
              </p>
            </div>
          </div>
          <div className="absolute bottom-6 right-6">
            <button
              onClick={() => {
                signOut(auth).then((e) => router.push("/"));
              }}
              id="logOut"
              className="bg-primary-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-primary-700 transition duration-300"
            >
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
