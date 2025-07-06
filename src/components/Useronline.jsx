import { useContext, useEffect } from "react";
import { AuthContext } from "../context/context";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { db } from "../services/Firebase";

export default function OnlineStatus() {
  const { user } = useContext(AuthContext);
console.log(user)
  useEffect(() => {
    const setUserOnline = async () => {
      if (!user) return;
      try {
        await setDoc(doc(db, "userStatus", user.uid), {
          displayName: user.displayName,
          status: "online",
          lastActive: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    };

    setUserOnline();
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (!user) return;
      try {
        await setDoc(doc(db, "userStatus", user.uid), {
          displayName: user.displayName,
          status: "offline",
          lastActive: serverTimestamp(),
        });
      } catch (error) {
        console.log(error);
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [user]);

  return null;
}
