// show group detail when entered

import { db } from "@/firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import ExerciseAccordion from "./exerciseAccordion_perfrom";

export default async function Page(props) {
  const declarationData = await getDoc(doc(db,'declarations', props.params.groupId,props.params.uid,props.params.id));
  const declaration = declarationData.data();
  console.log(declaration)
  return <ExerciseAccordion exercises={declaration.exercises}/>;
}
