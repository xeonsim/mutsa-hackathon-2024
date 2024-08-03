"use client";

import { useAuth } from "@/context/authProvider";
import { db } from "@/firebase/firebaseClient";
import { doc, updateDoc } from "firebase/firestore";

export function JoinButton({ groupId, members }) {
  const currentAuth = useAuth();
  const handleJoin = () => {
    if (members.includes(currentAuth.user.uid)) {
      alert("already joined!");
      return;
    } else {
      updateDoc(doc(db, "groups", groupId), {
        members: [...members, currentAuth.user.uid],
      })
        .then((e) => alert("joined!"))
        .catch((e) => console.log(e));
    }
  };
  return (
    <button
      className="bg-secondary-500 text-white font-bold py-3 px-6 rounded-layout hover:bg-primary-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
      onClick={handleJoin}
    >
      그룹 참여
    </button>
  );
}
