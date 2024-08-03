import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { db } from "@/firebase/firebaseClient";
import { collection, getDocs, query, where } from "firebase/firestore";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import Link from "next/link";

export default async function Home() {
  try {
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
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-secondary-700 mb-6">
          나의 그룹
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
                className="bg-white shadow-md rounded-layout p-6 hover:shadow-lg transition duration-300"
              >
                <h2 className="text-xl font-semibold text-secondary-700 mb-4">
                  {e.name}
                </h2>
                <div className="space-y-2 text-secondary-500">
                  <p>
                    <span className="font-medium">운동:</span>{" "}
                    {e.exercise.join(", ")}
                  </p>
                  <p>
                    <span className="font-medium">멤버수:</span>{" "}
                    {e.members.length}/{e.people}
                  </p>
                  <p>
                    <span className="font-medium">보증금:</span>{" "}
                    {e.deposit.toLocaleString()}원
                  </p>
                  <p>
                    <span className="font-medium">시작일:</span>{" "}
                    {starttime.toISOString().slice(0, 10)}
                  </p>
                  <p>
                    <span className="font-medium">기간:</span> {e.duration}주
                  </p>
                  <p>
                    <span className="font-medium">목표달성 횟수:</span>{" "}
                    {done.length}/{e.minFulfill}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="inline-block bg-primary-500 text-white text-sm font-bold py-2 px-4 rounded-layout hover:bg-primary-700 transition duration-300">
                    자세히 보기
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    );
  } catch (e) {
    redirect("/login");
  }
}
