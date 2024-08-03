import { db } from "@/firebase/firebaseClient";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import Link from "next/link";

const MemberCard = async ({ uid, groupId }) => {
  const userData = await getDoc(doc(db, "users", uid));
  const user = userData.data();
  const declarationData = await getDocs(
    collection(db, "declarations", groupId, uid)
  );
  return (
    <div className="border m-3 flex justify-between px-10">
      <div>
        <div className="flex">
          <div>{user.name}</div>
          <div>{user.email}</div>
        </div>
        <div>선언 수 {declarationData.size}</div>
      </div>
      <Link
        href={`/viewDeclaration/${uid}/${groupId}`}
        className="border m-3 bg-blue-500"
      >
        선언 보기
      </Link>
    </div>
  );
};

export default MemberCard;
