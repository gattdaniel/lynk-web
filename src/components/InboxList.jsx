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
import { Link, useParams } from "react-router-dom";

// Helper — initiales
const getInitials = (name = "") =>
  name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

// Helper — heure ou date
const formatTime = (timestamp) => {
  if (!timestamp?.toDate) return "";
  const date = timestamp.toDate();
  const today = new Date();
  if (date.toDateString() === today.toDateString()) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short" });
};

export default function InboxList() {
  const { user } = useContext(AuthContext);
  const { uid: activeUid } = useParams();
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    if (!user?.uid) return;
     console.log("UID connecté :", user.uid) 

    const q = query(
      collection(db, "privateChats"),
      where("participants", "array-contains", user.uid)
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
        console.log("Snapshot docs:", snapshot.docs.length) 
      const raw = snapshot.docs.map((d) => d.data());
        console.log("Raw messages:", raw)
      const uniqueUsers = new Map();

      for (const msg of raw) {
        const otherUID = msg.participants.find((uid) => uid !== user.uid);
        if (!otherUID) continue;

        const existing = uniqueUsers.get(otherUID);
        const msgTime = msg.timestamp?.toMillis() || 0;
        const existingTime = existing?.timestamp?.toMillis() || 0;

        if (!existing || msgTime > existingTime) {
          const userDoc = await getDoc(doc(db, "users", otherUID));
          const userData = userDoc.exists() ? userDoc.data() : {};
          const displayName = userData.displayName || userData.name || "Utilisateur";

          uniqueUsers.set(otherUID, {
            to: otherUID,
            displayName,
            photoURL: userData.photoURL || null,
            online: userData.online || false,
            lastMessage: msg.message || (msg.mediaType ? `📎 ${msg.mediaType}` : ""),
            timestamp: msg.timestamp,
          });
        }
      }

      // Trier par message le plus récent
      const sorted = Array.from(uniqueUsers.values()).sort(
        (a, b) => (b.timestamp?.toMillis() || 0) - (a.timestamp?.toMillis() || 0)
      );

      setConversations(sorted);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <div className="w-full md:w-[20vw] h-screen overflow-y-auto flex flex-col custom-scrollbar bg-[rgb(31,36,46)]">

      {/* EN-TÊTE */}
      <div className="px-4 py-4 border-b border-gray-700 flex-shrink-0">
        <h2 className="text-base font-bold text-white">💬 Discussions</h2>
        <p className="text-xs text-gray-400 mt-0.5">{conversations.length} conversation{conversations.length > 1 ? "s" : ""}</p>
      </div>

      {/* LISTE VIDE */}
      {conversations.length === 0 && (
        <div className="flex flex-col items-center justify-center flex-1 text-gray-500 px-4">
          <p className="text-3xl mb-2">📭</p>
          <p className="text-sm text-center">Aucune discussion pour le moment.</p>
          <p className="text-xs text-center mt-1">Écrivez à quelqu'un pour commencer !</p>
        </div>
      )}

      {/* LISTE DES CONVERSATIONS */}
      <div className="flex flex-col gap-1 p-2">
        {conversations.map((conv) => {
          const isActive = activeUid === conv.to;
          return (
            <Link
              key={conv.to}
              to={`/chat/${conv.to}`}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200
                ${isActive
                  ? "bg-[#0b525b] shadow-lg shadow-teal-900/30"
                  : "hover:bg-[rgb(43,53,66)]"
                }`}
            >
              {/* Avatar + point statut */}
              <div className="relative flex-shrink-0">
                {conv.photoURL ? (
                  <img
                    src={conv.photoURL}
                    alt={conv.displayName}
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-700"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-[#0b525b] flex items-center justify-center text-white text-xs font-bold border-2 border-gray-700">
                    {getInitials(conv.displayName)}
                  </div>
                )}

                {/* Point en ligne */}
                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[rgb(31,36,46)]
                  ${conv.online ? "bg-green-500" : "bg-gray-500"}`}
                ></div>
              </div>

              {/* Infos */}
              <div className="flex-1 overflow-hidden">
                <div className="flex justify-between items-center">
                  <p className="text-white text-sm font-semibold truncate">
                    {conv.displayName}
                  </p>
                  <span className="text-xs text-gray-400 flex-shrink-0 ml-1">
                    {formatTime(conv.timestamp)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs truncate mt-0.5">
                  {conv.lastMessage || "Démarrer la conversation"}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
