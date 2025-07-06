import { useEffect, useState, useContext } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import { AuthContext } from "../context/context";
import { Link } from "react-router-dom";

export default function InboxList() {
  const { user } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;

    const q = query(
      collection(db, "privateChats"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const raw = snapshot.docs.map((doc) => doc.data());
      const uniqueUsers = new Map();

      for (const msg of raw) {
        const otherUID = msg.participants.find((uid) => uid !== user.uid);

        if (
          otherUID &&
          (!uniqueUsers.has(otherUID) ||
            msg.timestamp?.toMillis() >
              (uniqueUsers.get(otherUID)?.timestamp?.toMillis() || 0))
        ) {
          const userDoc = await getDoc(doc(db, "users", otherUID));
          const userData = userDoc.exists()
            ? userDoc.data()
            : { displayName: "Nom inconnu" };

          const displayName = userData.displayName || userData.name || "Nom inconnu";
 console.log("UID:", otherUID, "User data:", userData);
          const fallbackAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
            displayName
          )}&background=127f8a&color=ffffff&bold=true&length=2&rounded=true&size=64&font-size=0.5`;

          uniqueUsers.set(otherUID, {
            to: otherUID,
            displayName,
            photoURL: userData.photoURL || fallbackAvatar,
            timestamp: msg.timestamp,
          });
        }

      }

      const conversationsArray = Array.from(uniqueUsers.values());
      setConversations(conversationsArray);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="space-y-4 w-full text-white">
      <h2 className="text-xl font-bold mb-2 text-white">Mes discussions</h2>
      {conversations.length === 0 && <p>Aucune discussion pour le moment.</p>}
      {conversations.map((conv) => (
        <Link
          key={conv.to}
          to={`/chat/${conv.to}`}
          className="block p-3 rounded bg-[#20838e] hover:bg-[#0b525b] transition"
        >
          <div className="flex items-center gap-2">
            <img
              src={conv.photoURL}
              alt="avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="font-semibold truncate">{conv.displayName}</div>
          </div>
        </Link>
      ))}
    </div>
  );
}
