// show list of groups when entered
"use client";

import { useAuth } from "@/context/authProvider";
import { db } from "@/firebase/firebaseClient";
import { collection, onSnapshot } from "firebase/firestore";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [groups, setGroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const currentAuth = useAuth();
  useEffect(() => {
    onSnapshot(collection(db, "groups"), (querySnapshot) => {
      setGroups(
        querySnapshot.docs.map((e) => {
          const data = e.data();
          return { id: e.id, ...data };
        })
      );
    });
  }, []);

  const filteredGroups = groups.filter((group) => {
    const name = group.name.toLowerCase();

    return name.includes(searchQuery.toLowerCase());
  });
  return (
    <div className="grid grid-cols-1 gap-2">
      <div className="flex justify-between">
        <h2>Groups</h2>
        <Link
          href="/group/create"
          className="font-bold m-3 mx-6 w-20 px-3 rounded text-white bg-gray-400"
        >
          Create
        </Link>
      </div>
      <input
        type="text"
        placeholder="Search..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full md:w-1/3 p-2 border border-gray-300 rounded-lg"
      />
      {filteredGroups.map((el, index) => (
        <Link key={index} href={`/group/${el.id}`}>
          <div className="border-2">
            <p>{el.name}</p>
            <p>운동: {el.exercise.join(", ")}</p>
            <p>보증금: {el.deposit.toLocaleString()}원</p>
            <p>기간: {el.duration}주</p>
            <p>인원: {el.people}명</p>
            <p>
              {el.members.includes(currentAuth.user.uid) ? "가입됨" : "미가입"}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
