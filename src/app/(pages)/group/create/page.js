// pages/index.js
"use client";
import { useAuth } from "@/context/authProvider";
import { db } from "@/firebase/firebaseClient";
import { addDoc, collection } from "firebase/firestore";
import { useState } from "react";

export default function Page() {
  const [selectedExercises, setSelectedExercises] = useState([]);
  const [name, setName] = useState("");

  const [deposit, setDeposit] = useState(10000);
  const [duration, setDuration] = useState(26);
  const [people, setPeople] = useState(6);
  const [minFulfill, setMinFulFill] = useState(1);
  const currentAuth = useAuth();
  const handleExerciseChange = (exercise) => {
    setSelectedExercises((prev) => {
      if (prev.includes(exercise)) {
        return prev.filter((item) => item !== exercise);
      } else {
        return [...prev, exercise];
      }
    });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(
      selectedExercises,
      deposit,
      duration,
      people,
      currentAuth.user.uid
    );
    const today = new Date();
    addDoc(collection(db, "groups"), {
      name: name,
      exercise: selectedExercises,
      deposit: deposit,
      duration: duration,
      people: people,
      minFulfill: minFulfill,
      timestamp: today.getTime(),
      creator: currentAuth.user.uid,
      members: [currentAuth.user.uid],
    })
      .then(() => alert("success"))
      .catch((e) => console.log(e));
  };

  return (
    <div className="container mx-auto px-layout py-layout">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md rounded-layout p-layout"
      >
        <h2 className="text-2xl font-bold text-secondary-700 mb-6">
          새 그룹 만들기
        </h2>
        <div className="mb-4">
          <label
            className="block text-secondary-700 font-bold mb-2"
            htmlFor="name"
          >
            이름
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            className="w-full p-3 border border-secondary-300 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="생성할 그룹명을 입력해 주세요."
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div className="mb-4">
          <label className="block text-secondary-700 font-bold mb-2">
            운동
          </label>
          <div className="flex flex-wrap gap-4">
            {["스쿼트", "런지", "푸시업", "브릿지"].map((exercise) => (
              <label key={exercise} className="inline-flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox text-primary-500"
                  checked={selectedExercises.includes(exercise)}
                  onChange={() => handleExerciseChange(exercise)}
                />
                <span className="ml-2">{exercise}</span>
              </label>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <label
            className="block text-secondary-700 font-bold mb-2"
            htmlFor="deposit"
          >
            보증금
          </label>
          <input
            type="range"
            id="deposit"
            name="deposit"
            min="10000"
            max="100000"
            step="1000"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-secondary-500">
            {deposit.toLocaleString()}원
          </span>
        </div>
        <div className="mb-4">
          <label
            className="block text-secondary-700 font-bold mb-2"
            htmlFor="duration"
          >
            기간
          </label>
          <input
            type="range"
            id="duration"
            name="duration"
            min="1"
            max="52"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-secondary-500">{duration}주</span>
        </div>
        <div className="mb-4">
          <label
            className="block text-secondary-700 font-bold mb-2"
            htmlFor="people"
          >
            인원
          </label>
          <input
            type="range"
            id="people"
            name="people"
            min="2"
            max="10"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-secondary-500">{people}명</span>
        </div>
        <div className="mb-6">
          <label
            className="block text-secondary-700 font-bold mb-2"
            htmlFor="fulfill"
          >
            최소 달성 횟수
          </label>
          <input
            type="range"
            id="fulfill"
            name="fulfill"
            min="1"
            max="100"
            value={minFulfill}
            onChange={(e) => setMinFulFill(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-secondary-500">{minFulfill}회</span>
        </div>
        <button
          className="bg-primary-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-primary-700 transition duration-300"
          type="submit"
        >
          Create Group
        </button>
      </form>
    </div>
  );
}
