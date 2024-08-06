"use client";
// components/Accordion.js
import { useState } from "react";

const ExerciseAccordion = ({ exercises }) => {
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="accordion">
      {exercises.map((exercise, index) => (
        <div key={index} className="accordion-item">
          <div className="accordion-title" onClick={() => handleToggle(index)}>
            {exercise.type}
            <span>{activeIndex === index ? "-" : "+"}</span>
          </div>
          {activeIndex === index && (
            <div className="accordion-content">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="set-item">
                  세트 {setIndex + 1}: {set} 회
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
      <style jsx>{`
        .accordion {
          border: 1px solid #ccc;
          border-radius: 5px;
        }
        .accordion-item {
          border-bottom: 1px solid #ccc;
        }
        .accordion-title {
          padding: 15px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        .accordion-content {
          padding: 15px;
          background-color: #f9f9f9;
        }
        .set-item {
          padding: 5px 0;
        }
        .accordion-title span {
          font-size: 1.5rem;
        }
      `}</style>
    </div>
  );
};

export default ExerciseAccordion;
