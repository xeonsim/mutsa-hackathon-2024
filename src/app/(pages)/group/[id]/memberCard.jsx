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
    <div className="bg-white shadow-md rounded-layout p-5 flex justify-between items-center">
      <div>
        <div className="flex space-x-4 mb-2">
          <div className="font-semibold text-secondary-700 text-lg">
            {user.name}
          </div>
          <div className="text-secondary-500 text-lg">{user.email}</div>
        </div>
        <div className="text-secondary-500 text-base">
          선언 수: {declarationData.size}
        </div>
      </div>
      <Link
        href={`/viewDeclaration/${uid}/${groupId}`}
        className="bg-primary-500 text-white font-bold py-2 px-4 rounded-layout hover:bg-primary-700 transition duration-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 text-base"
      >
        선언 보기
      </Link>
    </div>
  );
};

export default MemberCard;
