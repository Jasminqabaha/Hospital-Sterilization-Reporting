import { collection, onSnapshot } from "firebase/firestore";
import { firestoreDb } from "./firebase";

export const useFirestore = (collectionName, setData) => {
  // Listen for real-time updates
  const unsubscribe = onSnapshot(collection(firestoreDb, collectionName), (snapshot) => {
    const data = snapshot.docs.map((doc) => ({
      id: doc.id, // Include document ID
      ...doc.data(), // Document fields
    }));
    setData(data); // Update state in the React component
  });

  return unsubscribe; // Call this to stop listening when the component unmounts
};
