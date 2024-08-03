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
    <div className="container mx-auto px-layout py-layout">
      <h1 className="text-3xl font-bold text-secondary-700 mb-layout">
        {user.name}님의 선언
      </h1>
      <div className="space-y-layout">
        {declarations.map((e, index) => (
          <div
            key={index}
            className="bg-white shadow-md rounded-layout p-layout"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="space-y-2">
                <p className="text-secondary-700 font-semibold">
                  날짜: {e.date}
                </p>
                <p className="text-secondary-500">설명: {e.description}</p>
                <p
                  className={`font-semibold ${
                    e.fulfilled ? "text-accent-500" : "text-primary-500"
                  }`}
                >
                  {e.fulfilled ? "완료" : "미완료"}
                </p>
              </div>
              <div>
                {!e.fulfilled && (
                  <Link
                    href={`/performDeclaration/${uid}/${props.params.groupId}/${e.id}`}
                    className="bg-primary-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-primary-700 transition duration-300"
                  >
                    선언 수행
                  </Link>
                )}
              </div>
            </div>
            <ExerciseAccordion exercises={e.exercises} />
          </div>
        ))}
      </div>
    </div>
  );
}
