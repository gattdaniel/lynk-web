import { collection, onSnapshot, query, where } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../services/Firebase";

export default function OnlineUsersList() {
  const [onlineUsers, setOnlineUsers] = useState([]);

  useEffect(() => {
    const q = query(
      collection(db, "userStatus"),
      where("status", "==", "online")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOnlineUsers(users);
      console.log("Utilisateurs en ligne :", users);
    });

    // Nettoyage de l'écouteur Firestore à la fermeture du composant
    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="fixed bg-[#204b57] h-[8vh] top-0 text-white  flex items-center justify-center w-52">
        <h2 className="text-center text-xl font-bold top-2">
          Utilisateurs en ligne{" "}
        </h2>
      </div>
      <ul className="space-y-4 ">
        {onlineUsers.map((user) => (
          <li
            className="flex-1  px-4  h-[5vh] text-white  text-center py-1 bg-[#0b525b] rounded-lg "
            key={user.id}
          >
            {user.displayName || "Utilisateur anonyme"}
          </li>
        ))}
      </ul>
    </>
  );
}
