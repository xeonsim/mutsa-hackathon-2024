// show group detail when entered

import { db } from "@/firebase/firebaseClient";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import ExerciseAccordion from "./exerciseAccordion";
import Link from "next/link";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import { verifyIdToken } from "@/firebase/firebaseAdmin";

export default async function Page(props) {
  const userData = await getDoc(doc(db, "users", props.params.uid));
  const user = userData.data();
  const declarationData = await getDocs(
    collection(db, "declarations", props.params.groupId, props.params.uid)
  );
  const declarations = declarationData.docs.map((e) => {
    const data = e.data();
    return { id: e.id, ...data };
  });

  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/login");
  }
  const decodedToken = await verifyIdToken(token.value);
  const { uid, email } = decodedToken;

  return (
    <div>
      <div>{user.name}</div>
      <div>
        {declarations.map((e, index) => (
          <div key={index} className="border m-3">
            <div className="flex justify-between">
              <div>
                <p>날짜: {e.date}</p>
                <p>설명: {e.description}</p>
                <p>완료여부: {e.fulfilled ? "완료" : "미완료"}</p>
              </div>
              <div>
                <Link
                  href={`/performDeclaration/${uid}/${props.params.groupId}/${e.id}`}
                  className="bg-blue-400 rounded"
                >
                  선언 수행
                </Link>
              </div>
            </div>
            <ExerciseAccordion exercises={e.exercises} />
          </div>
        ))}
      </div>
    </div>
  );
}
