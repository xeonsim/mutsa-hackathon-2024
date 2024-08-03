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
    <div className="">
      <form onSubmit={handleSubmit}>
        <div className="">
          <label>이름</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            className="border"
            placeholder="enter name..."
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <label>운동</label>
        <div className="flex">
          {["스쿼트", "런지", "푸시업", "브릿지"].map((exercise) => (
            <p key={exercise}>
              <input
                type="checkbox"
                id={exercise}
                name="exercises"
                value={exercise}
                checked={selectedExercises.includes(exercise)}
                onChange={() => handleExerciseChange(exercise)}
              />
              <label htmlFor={exercise}>{exercise}</label>
            </p>
          ))}
        </div>
        <div className="">
          <label>보증금</label>
          <input
            type="range"
            id="deposit"
            name="deposit"
            min="10000"
            max="100000"
            step="1000"
            value={deposit}
            onChange={(e) => setDeposit(Number(e.target.value))}
          />
          <span id="depositValue">{deposit.toLocaleString()}원</span>
        </div>
        <div className="">
          <label htmlFor="duration">기간</label>
          <input
            type="range"
            id="duration"
            name="duration"
            min="1"
            max="52"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
          />
          <span id="durationValue">{duration}주</span>
        </div>
        <div className="">
          <label htmlFor="people">인원</label>
          <input
            type="range"
            id="people"
            name="people"
            min="2"
            max="10"
            value={people}
            onChange={(e) => setPeople(Number(e.target.value))}
          />
          <span id="peopleValue">{people}명</span>
        </div>
        <div className="">
          <label htmlFor="people">최소 달성 횟수</label>
          <input
            type="range"
            id="fulfill"
            name="fulfill"
            min="1"
            max="100"
            value={minFulfill}
            onChange={(e) => setMinFulFill(Number(e.target.value))}
          />
          <span id="fulfillValue">{minFulfill}회</span>
        </div>
        <button className="border" type="submit">
          Create Group
        </button>
      </form>
    </div>
  );
}
