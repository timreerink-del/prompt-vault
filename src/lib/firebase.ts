import { initializeApp, getApps } from "firebase/app";
import {
  getFirestore,
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  getDocs,
  writeBatch,
} from "firebase/firestore";
import { Prompt, PromptVersion } from "./types";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
const db = getFirestore(app);

const promptsCollection = collection(db, "prompts");

export async function createPrompt(
  data: Omit<Prompt, "id" | "createdAt" | "updatedAt">
) {
  return addDoc(promptsCollection, {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
}

export async function updatePrompt(id: string, data: Partial<Prompt>) {
  const ref = doc(db, "prompts", id);
  const { id: _id, createdAt: _ca, ...rest } = data as Record<string, unknown>;
  void _id;
  void _ca;
  return updateDoc(ref, {
    ...rest,
    updatedAt: serverTimestamp(),
  });
}

export async function removePrompt(id: string) {
  return deleteDoc(doc(db, "prompts", id));
}

export async function addVersion(
  promptId: string,
  version: Omit<PromptVersion, "id" | "savedAt">
) {
  const versionsCol = collection(db, "prompts", promptId, "versions");
  return addDoc(versionsCol, {
    ...version,
    savedAt: serverTimestamp(),
  });
}

export function subscribeToPrompts(callback: (prompts: Prompt[]) => void) {
  const q = query(promptsCollection, orderBy("updatedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const prompts = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as Prompt[];
    callback(prompts);
  });
}

export function subscribeToVersions(
  promptId: string,
  callback: (versions: PromptVersion[]) => void
) {
  const versionsCol = collection(db, "prompts", promptId, "versions");
  const q = query(versionsCol, orderBy("savedAt", "desc"));
  return onSnapshot(q, (snapshot) => {
    const versions = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    })) as PromptVersion[];
    callback(versions);
  });
}

export async function isCollectionEmpty(): Promise<boolean> {
  const snapshot = await getDocs(promptsCollection);
  return snapshot.empty;
}

export async function getAllPromptTitles(): Promise<string[]> {
  const snapshot = await getDocs(promptsCollection);
  return snapshot.docs.map((d) => (d.data().title as string) || "");
}

export async function batchCreatePrompts(
  items: Omit<Prompt, "id" | "createdAt" | "updatedAt">[]
) {
  const batch = writeBatch(db);
  for (const item of items) {
    const ref = doc(promptsCollection);
    batch.set(ref, {
      ...item,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
  }
  return batch.commit();
}

export async function migrateActionFields(
  seedData: { title: string; actionType?: string; installCommand?: string; sourceUrl?: string; linkedItems?: string[] }[]
) {
  const snapshot = await getDocs(promptsCollection);
  const batch = writeBatch(db);
  let count = 0;

  for (const docSnap of snapshot.docs) {
    const data = docSnap.data();
    const updates: Record<string, unknown> = {};
    const seed = seedData.find((s) => s.title === data.title);

    // Add actionType if missing
    if (!data.actionType) {
      updates.actionType = seed?.actionType || "copy";
      updates.installCommand = seed?.installCommand || "";
      updates.sourceUrl = seed?.sourceUrl || "";
    }

    // Add linkedItems if missing
    if (!data.linkedItems) {
      updates.linkedItems = seed?.linkedItems || [];
    }

    // Rename template → agent
    if (data.category === "template") {
      updates.category = "agent";
    }

    if (Object.keys(updates).length > 0) {
      batch.update(docSnap.ref, updates);
      count++;
    }
  }

  if (count > 0) await batch.commit();
}

export { db };
