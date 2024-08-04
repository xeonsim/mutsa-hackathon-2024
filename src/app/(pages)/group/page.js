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
    <div className="container mx-auto px-layout pt-8">
      {/* Added top padding */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h2 className="text-3xl font-bold text-secondary-700 mb-4 md:mb-0">
          Groups
        </h2>
        <div className="flex flex-col md:flex-row w-full md:w-auto items-stretch md:items-center">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 p-3 mb-4 md:mb-0 md:mr-4 border border-secondary-100 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <Link
            href="/group/create"
            className="bg-primary-500 text-white font-bold py-3 px-6 rounded-layout hover:bg-primary-700 transition duration-300 text-center"
          >
            Create
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredGroups.map((el, index) => (
          <Link key={index} href={`/group/${el.id}`}>
            <div className="border-2 border-secondary-100 rounded-layout p-5 hover:shadow-md transition duration-300">
              <p className="text-xl font-semibold text-secondary-700 mb-3">
                {el.name}
              </p>
              <p className="text-secondary-500 mb-2">
                운동: {el.exercise.join(", ")}
              </p>
              <p className="text-secondary-500 mb-2">
                보증금: {el.deposit.toLocaleString()}원
              </p>
              <p className="text-secondary-500 mb-2">
                Current Cash Pool: {el.cashPool.toLocaleString()}원
              </p>
              <p className="text-secondary-500 mb-2">기간: {el.duration}주</p>
              <p className="text-secondary-500 mb-2">인원: {el.people}명</p>
              <p
                className={
                  el.members.includes(currentAuth.user.uid)
                    ? "text-accent-500 font-semibold"
                    : "text-secondary-500"
                }
              >
                {el.members.includes(currentAuth.user.uid)
                  ? "가입됨"
                  : "미가입"}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
