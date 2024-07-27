import serviceAccount from "./gba-seminar-firebase-adminsdk-ua3ar-ee9be10fb9.json";

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

export async function adminUpdateUser(uid, isDisabled) {
  initializeFirebaseAdmin();
  return getAuth().updateUser(uid, {
    disabled: isDisabled,
  });
}

export async function adminDeleteUser(uid) {
  initializeFirebaseAdmin();
  return getAuth().deleteUser(uid);
}

export async function verifyIdToken(token) {
  initializeFirebaseAdmin();
  return getAuth().verifyIdToken(token);
}
