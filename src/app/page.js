import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { db } from "@/firebase/firebaseClient";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/dist/server/api-utils";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/login");
  }
  const decodedToken = await verifyIdToken(token.value);
  const { uid, email } = decodedToken;
  const joinedGroupsData = await getDocs(
    query(
      collection(db, "groups"),
      where("members", "array-contains-any", [uid])
    )
  );
  const joinedGroups = joinedGroupsData.docs.map((e) => {
    const data = e.data();
    return { id: e.id, ...data };
  });

  return (
    <div>
      <h1>나의 그룹</h1>
      <div>
        {joinedGroups.map(async (e, i) => {
          const starttime = new Date(e.timestamp);
          const declarationData = await getDocs(
            collection(db, "declarations", e.id, uid)
          );
          const declarations = declarationData.docs.map((el) => {
            const data = el.data();
            return { id: el.id, ...data };
          });
          const done = declarations.filter((e) => e.fulfilled);
          return (
            <Link
              key={i}
              href={`/group/${e.id}`}
              className="border m-3 flex p-3 justify-between"
            >
              <p>{e.name}</p>
              <p>운동: {e.exercise.join(", ")}</p>
              <p>
                멤버수: {e.members.length}/{e.people}
              </p>
              <p>보증금 : {e.deposit}</p>
              <p>시작일 : {starttime.toISOString().slice(0, 10)}</p>
              <p>기간 : {e.duration}</p>
              <p>
                목표달성 횟수 : {done.length}/{e.minFulfill}
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
