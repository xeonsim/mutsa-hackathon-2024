// show group detail when entered

import { db } from "@/firebase/firebaseClient";
import { doc, getDoc } from "firebase/firestore";
import { JoinButton } from "./joinButton";
import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { cookies } from "next/headers";
import Link from "next/link";
import MemberCard from "./memberCard";

export default async function Page(props) {
  const groupData = await getDoc(doc(db, "groups", props.params.id));
  const groupDetail = groupData.data();

  const creatorData = await getDoc(doc(db, "users", groupDetail.creator));
  const creatorDetail = creatorData.data();
  const cookieStore = cookies();
  const token = cookieStore.get("token");
  if (!token) {
    redirect("/login");
  }
  const decodedToken = await verifyIdToken(token.value);
  const { uid, email } = decodedToken;

  const otherMembers = groupDetail.members.filter((e) => e != uid);

  return (
    <div className="container mx-auto px-layout">
      <div className="bg-white shadow-md rounded-layout p-layout mb-layout">
        <h2 className="text-2xl font-bold text-secondary-700 mb-4">
          {groupDetail.name}
        </h2>
        <p className="text-secondary-500 mb-2">Creator: {creatorDetail.name}</p>
        <p className="text-secondary-500 mb-2">
          운동: {groupDetail.exercise.join(", ")}
        </p>
        <p className="text-secondary-500 mb-2">
          보증금: {groupDetail.deposit.toLocaleString()}원
        </p>
        <p className="text-secondary-500 mb-2">
          기간: {groupDetail.duration}주
        </p>
        <p className="text-secondary-500 mb-2">
          최대 인원: {groupDetail.people}명
        </p>
        <p className="text-secondary-500 mb-2">
          현재 인원: {groupDetail.members.length}명
        </p>
        <p className="text-secondary-500 mb-2">
          최소 달성 횟수: {groupDetail.minFulfill}회
        </p>
      </div>
      <div className="mt-layout">
        {!groupDetail.members.includes(uid) ? (
          <JoinButton groupId={groupData.id} members={groupDetail.members} />
        ) : (
          <Link
            href={`/createDeclaration/${groupData.id}`}
            className="bg-accent-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-accent-700 transition duration-300"
          >
            선언하기
          </Link>
        )}
      </div>
      <div className="mt-layout">
        <h3 className="text-xl font-semibold text-secondary-700 mb-4">
          내 정보
        </h3>
        <div className="space-y-4">
          <MemberCard uid={uid} groupId={props.params.id} />
        </div>
      </div>
      <div className="mt-layout">
        <h3 className="text-xl font-semibold text-secondary-700 mb-4">
          다른 멤버
        </h3>
        <div className="space-y-4">
          {otherMembers.map((e, index) => (
            <MemberCard key={index} uid={e} groupId={props.params.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
