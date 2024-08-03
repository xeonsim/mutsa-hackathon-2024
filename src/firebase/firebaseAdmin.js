import serviceAccount from "./test.json";

// app/firebaseAdmin.js
import { initializeApp, getApps, cert } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

const firebaseAdminConfig = {
  credential: cert(serviceAccount),
};

export function initializeFirebaseAdmin() {
  if (!getApps().length) {
    initializeApp(firebaseAdminConfig);
  }
}

export { getAuth };

export async function verifyIdToken(token) {
  initializeFirebaseAdmin();
  return getAuth().verifyIdToken(token);
}
