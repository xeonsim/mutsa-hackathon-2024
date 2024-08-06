// show group detail when entered

import { db } from "@/firebase/firebaseClient";
import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { JoinButton } from "./joinButton";
import { verifyIdToken } from "@/firebase/firebaseAdmin";
import { cookies } from "next/headers";
import Link from "next/link";
import MemberCard from "./memberCard";
import { GroupCalendar } from "../../../../components/Calendar";

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
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <GroupCalendar groupId={props.params.id} members={groupDetail.members} className='z-0'/>
      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-2xl font-bold text-secondary-700 mb-4 break-words">
          {groupDetail.name}
        </h2>
        <div className="space-y-2 text-secondary-500">
          <p className="break-words">그룹 주인: {creatorDetail.name}</p>
          <p>운동: {groupDetail.exercise.join(", ")}</p>
          <p>보증금: {groupDetail.deposit.toLocaleString()}원</p>
          <p>총합: {groupDetail.cashPool.toLocaleString()}원</p>
          <p>기간: {groupDetail.duration}주</p>
          <p>최대 인원: {groupDetail.people}명</p>
          <p>현재 인원: {groupDetail.members.length}명</p>
          <p>최소 달성 횟수: {groupDetail.minFulfill}회</p>
        </div>
      </div>
      <div className="mt-6">
        {!groupDetail.members.includes(uid) ? (
          <JoinButton
            groupId={groupData.id}
            members={groupDetail.members}
            deposit={groupDetail.deposit}
          />
        ) : (
          <Link
            href={`/createDeclaration/${groupData.id}`}
            className="inline-block bg-accent-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-accent-700 transition duration-300"
          >
            선언하기
          </Link>
        )}
      </div>
      <div className="mt-6">
        <h3 className="text-xl font-semibold text-secondary-700 mb-4">
          내 정보
        </h3>
        <div className="space-y-4">
          <MemberCard uid={uid} groupId={props.params.id} />
        </div>
      </div>
      <div className="mt-6">
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
