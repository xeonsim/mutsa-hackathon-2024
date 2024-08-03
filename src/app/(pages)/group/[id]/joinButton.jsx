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
    <>
      <button
        className="bg-gray-500 rounded p-3 text-white"
        onClick={handleJoin}
      >
        join group
      </button>
    </>
  );
}
