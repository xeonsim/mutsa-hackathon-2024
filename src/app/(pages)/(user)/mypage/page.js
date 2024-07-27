"use client";

import { auth, db } from "@/app/firebase/firebaseClient";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function MyPage() {
  const router = useRouter();
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setTimeout(() => {
      const userAuth = auth.currentUser;
      if (userAuth) {
        const ref = doc(db, "users", userAuth.uid);
        getDoc(ref).then((res) => {
          const data = res.data();
          setUserName(decode(data.name));
          setUserEmail(decode(data.email));
        });
      } else {
        router.push("/");
      }
    }, 1000);
  }, [router]);

  return (
    <div>
      <div>
        <div>
          <h3>{userName}</h3>
          <div>{userEmail}</div>
        </div>
      </div>
      <div>
        <button
          onClick={() => {
            signOut(auth).then((e) => router.push("/"));
          }}
          id="logOut"
        >
          LogOut
        </button>
      </div>
    </div>
  );
}
