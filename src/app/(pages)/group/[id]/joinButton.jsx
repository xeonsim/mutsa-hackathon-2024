"use client";

import { useAuth } from "@/context/authProvider";
import { db } from "@/firebase/firebaseClient";
import { arrayUnion, doc, increment, updateDoc } from "firebase/firestore";

export function JoinButton({ groupId, members, deposit }) {
  const currentAuth = useAuth();
  const handleJoin = async () => {
    const res = confirm("가입시 보증금을 지불해야 합니다. 가입하시겠습니까?");
    if (members.includes(currentAuth.user.uid)) {
      alert("already joined!");
      return;
    } else if (!res) {
      return;
    } else if (res) {
      updateDoc(doc(db, "users", currentAuth.user.uid), {
        deposit: increment(-deposit),
      })
        .then((e) => {
          updateDoc(doc(db, "groups", groupId), {
            members: arrayUnion(currentAuth.user.uid),
            cashPool: increment(deposit),
          })
            .then((e) => alert("joined!"))
            .catch((e) => console.log(e));
        })
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
