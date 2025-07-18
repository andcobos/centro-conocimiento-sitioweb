// lib/firebase-test.ts
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";

export async function testFirebaseConnection() {
  const snapshot = await getDocs(collection(db, "study_rooms"));
  const data = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));

  console.log("✅ Firebase funciona. Datos:", data);
}
