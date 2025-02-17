import { ref, onValue } from "firebase/database";
import { realtimeDb } from "./firebase";

export const useRealtimeDb = (path, setData) => {
  const dbRef = ref(realtimeDb, path);

  const unsubscribe = onValue(dbRef, (snapshot) => {
    const data = snapshot.val();
    const formattedData = data
      ? Object.keys(data).map((key) => ({
          id: key, // Include the key as ID
          ...data[key],
        }))
      : [];
    setData(formattedData); // Update state in the React component
  });

  return unsubscribe; // Call this to stop listening when the component unmounts
};
