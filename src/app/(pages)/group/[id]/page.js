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
    <div>
      <div>
        <p>{groupDetail.name}</p>
        <p>Creator: {creatorDetail.name}</p>
        <p>운동: {groupDetail.exercise.join(", ")}</p>
        <p>보증금: {groupDetail.deposit.toLocaleString()}원</p>
        <p>기간: {groupDetail.duration}주</p>
        <p>최대 인원: {groupDetail.people}명</p>
        <p>현재 인원: {groupDetail.members.length}명</p>
        <p>최소 달성 횟수: {groupDetail.minFulfill}회</p>
      </div>
      <div className="mt-3">
        {!groupDetail.members.includes(uid) ? (
          <JoinButton groupId={groupData.id} members={groupDetail.members} />
        ) : (
          <Link
            href={`/createDeclaration/${groupData.id}`}
            className="border rounded bg-gray-100 p-2 mt-10"
          >
            선언하기
          </Link>
        )}
      </div>
      <div className="mt-3">
        <h3>내 정보</h3>
        <MemberCard uid={uid} groupId={props.params.id} />
      </div>
      <div>
        <h3>Other Members</h3>
        {otherMembers.map((e, index) => (
          <MemberCard key={index} uid={e} groupId={props.params.id} />
        ))}
      </div>
    </div>
  );
}
