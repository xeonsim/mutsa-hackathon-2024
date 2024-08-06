"use client";
// components/Accordion.js
import { useRef, useState } from "react";
import confirmModal from "./ExerciseModal";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebaseClient";
import { useRouter } from "next/navigation";

const ExerciseAccordion = ({ exercises, groupId, uid, id }) => {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(null);

  const handleToggle = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  const exerciseState = useRef(exercises.map(el=>{return {...el,complete:Array.from({length:el.sets.length},()=>false)}}));
  const [ex,setEx] = useState(exerciseState.current);

  const handleComplete = (type,index) =>{
    const newEx = ex.map((el)=>{
      if(el.type == type){
        el.complete[index] = true;
        return el
      } else{
        return el
      }
    });
    exerciseState.current = newEx;
    setEx(exerciseState.current)
    console.log(handleFulfill());
    if(handleFulfill()){
      updateDoc(doc(db,'declarations',groupId,uid,id),{fulfilled:true}).then(res=>{alert('완료!')
       
       router.back();
      })
    }
  }

  const handleFulfill = () =>{
    let fulfill = true;
    for(let el of ex){
      el.complete.forEach(element => {
        // console.log(element);
        if(!element){
          fulfill = false
        }
      }); 
    }
    return fulfill;
  }

  const handlePerform = (type,index,minCount) =>{
    confirmModal(()=>{
      handleComplete(type,index);
    }, type, minCount)

  }

  return (
    <div className="accordion">
      {ex.map((exercise, index) => (
        <div key={index} className="accordion-item">
          <div className="accordion-title" onClick={() => handleToggle(index)}>
            {exercise.type}
            <span>{activeIndex === index ? "-" : "+"}</span>
          </div>
          {activeIndex === index && (
            <div className="accordion-content">
              {exercise.sets.map((set, setIndex) => (
                <div key={setIndex} className="set-item">
                  <div className="flex justify-between px-3">
                    <p>
                    세트 {setIndex + 1}: {set} 회
                    </p>               
                    {!exercise.complete[setIndex]?
                      <button onClick={()=>{handlePerform(exercise.type,setIndex,set)}}>수행하기</button>:
                      <p>Complete</p>
                    }
                  </div>
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
