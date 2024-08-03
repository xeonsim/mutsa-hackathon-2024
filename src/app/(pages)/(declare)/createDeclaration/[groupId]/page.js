"use client";
import { useAuth } from "@/context/authProvider";
import { db } from "@/firebase/firebaseClient";
import { addDoc, collection, doc, getDoc } from "firebase/firestore";
import { useState, useEffect } from "react";

const ExerciseForm = (props) => {
  const today = new Date();
  const currentAuth = useAuth();
  const [date, setDate] = useState(today.toISOString().slice(0, 10));
  const [description, setDescription] = useState("");
  const [exercises, setExercises] = useState([]);
  const [mandatoryExercises, setMandatoryExercises] = useState([]);

  useEffect(() => {
    getDoc(doc(db, "groups", props.params.groupId)).then((res) => {
      const data = res.data();
      setMandatoryExercises(data.exercise);
    });
  }, []);

  const handleAddExercise = () => {
    setExercises([...exercises, { type: "", sets: [""] }]);
  };

  const handleAddSet = (exerciseIndex) => {
    const newExercises = exercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        return { ...exercise, sets: [...exercise.sets, ""] };
      }
      return exercise;
    });
    setExercises(newExercises);
  };

  const handleChange = (exerciseIndex, setIndex, value) => {
    const newExercises = exercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        const newSets = exercise.sets.map((set, i) => {
          if (i === setIndex) {
            return value;
          }
          return set;
        });
        return { ...exercise, sets: newSets };
      }
      return exercise;
    });
    setExercises(newExercises);
  };

  const handleExerciseTypeChange = (index, value) => {
    const newExercises = exercises.map((exercise, i) => {
      if (i === index) {
        return { ...exercise, type: value };
      }
      return exercise;
    });
    setExercises(newExercises);
  };

  const handleRemoveExercise = (index) => {
    setExercises(exercises.filter((_, i) => i !== index));
  };

  const handleRemoveSet = (exerciseIndex, setIndex) => {
    const newExercises = exercises.map((exercise, index) => {
      if (index === exerciseIndex) {
        return {
          ...exercise,
          sets: exercise.sets.filter((_, i) => i !== setIndex),
        };
      }
      return exercise;
    });
    setExercises(newExercises);
  };

  const validateMandatoryExercises = () => {
    const selectedExercises = exercises.map((exercise) => exercise.type);
    return mandatoryExercises.every((mandatoryExercise) =>
      selectedExercises.includes(mandatoryExercise)
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateMandatoryExercises()) {
      alert(`필수 운동을 선택해야 합니다: ${mandatoryExercises.join(", ")}`);
      return;
    } else {
      console.log(exercises);
      const time = new Date();
      addDoc(
        collection(
          db,
          "declarations",
          props.params.groupId,
          currentAuth.user.uid
        ),
        {
          date: date,
          description: description,
          exercises: exercises,
          timestamp: time.getTime(),
          fulfilled: false,
        }
      )
        .then((res) => {
          alert("운동 정보가 성공적으로 저장되었습니다!");
        })
        .catch((e) => alert("운동 정보를 저장하는데 실패했습니다."));
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-layout">
      <div className="mb-layout">
        <label className="block text-secondary-700 font-bold mb-2">
          수행 날짜:
        </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full p-2 border border-secondary-100 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>
      <div className="mb-layout">
        <label className="block text-secondary-700 font-bold mb-2">설명:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="운동 설명을 입력하세요"
          required
          className="w-full p-2 border border-secondary-100 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500 h-32"
        />
      </div>
      <div className="space-y-4 mb-layout">
        {exercises.map((exercise, index) => (
          <div
            key={index}
            className="border border-secondary-100 rounded-layout p-4"
          >
            <select
              value={exercise.type}
              onChange={(e) => handleExerciseTypeChange(index, e.target.value)}
              className="w-full p-2 mb-2 border border-secondary-100 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="">운동 종류 선택</option>
              {mandatoryExercises.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {exercise.sets.map((set, setIndex) => (
              <div key={setIndex} className="flex items-center mb-2">
                <input
                  type="number"
                  placeholder="횟수"
                  value={set}
                  onChange={(e) =>
                    handleChange(index, setIndex, e.target.value)
                  }
                  className="flex-grow p-2 border border-secondary-100 rounded-layout focus:outline-none focus:ring-2 focus:ring-primary-500 mr-2"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveSet(index, setIndex)}
                  className="bg-secondary-500 text-white px-3 py-1 rounded-layout hover:bg-secondary-700 transition duration-300"
                >
                  삭제
                </button>
              </div>
            ))}
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleAddSet(index)}
                className="bg-primary-500 text-white px-3 py-1 rounded-layout hover:bg-primary-700 transition duration-300"
              >
                세트 추가
              </button>
              <button
                type="button"
                onClick={() => handleRemoveExercise(index)}
                className="bg-secondary-500 text-white px-3 py-1 rounded-layout hover:bg-secondary-700 transition duration-300"
              >
                운동 삭제
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col space-y-2">
        <button
          type="button"
          onClick={handleAddExercise}
          className="bg-primary-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-primary-700 transition duration-300"
        >
          운동 추가
        </button>
        <button
          type="submit"
          className="bg-accent-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-accent-700 transition duration-300"
        >
          선언 제출
        </button>
      </div>
    </form>
  );
};

export default ExerciseForm;
