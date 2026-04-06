import {
  GoogleAuthProvider,
  signInWithPopup,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  getAuth,
  User,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";
import { getApps } from "firebase/app";

const ALLOWED_DOMAIN = "randstad.com";
const googleProvider = new GoogleAuthProvider();

function getAuthInstance() {
  const app = getApps()[0];
  return getAuth(app);
}

export async function signInWithGoogle(): Promise<{
  user: User | null;
  error: string | null;
}> {
  try {
    const auth = getAuthInstance();
    const result = await signInWithPopup(auth, googleProvider);
    const email = result.user.email || "";
    if (!email.endsWith(`@${ALLOWED_DOMAIN}`)) {
      await firebaseSignOut(auth);
      return {
        user: null,
        error: `Alleen @${ALLOWED_DOMAIN} accounts hebben toegang.`,
      };
    }
    return { user: result.user, error: null };
  } catch (err) {
    const message = (err as Error).message || "Inloggen mislukt";
    return { user: null, error: message };
  }
}

export async function signOut() {
  return firebaseSignOut(getAuthInstance());
}

export function onAuthChange(callback: (user: User | null) => void) {
  return onAuthStateChanged(getAuthInstance(), callback);
}

export async function fetchAdminList(): Promise<string[]> {
  try {
    const configDoc = await getDoc(doc(db, "metadata", "config"));
    if (configDoc.exists()) {
      const data = configDoc.data();
      return (data.admins as string[]) || [];
    }
    return [];
  } catch {
    return [];
  }
}

export function isAllowedDomain(email: string): boolean {
  return email.endsWith(`@${ALLOWED_DOMAIN}`);
}
