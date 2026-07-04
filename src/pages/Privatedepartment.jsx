import { useContext, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import { AuthContext } from "../context/context";
import Choice from "../components/choice";
import MessageSender from "../components/Handlesend";

// ===========================
// HELPERS
// ===========================
const getColor = (name = "") => {
  const colors = [
    "#0b525b",
    "#e17055",
    "#6c5ce7",
    "#00b894",
    "#fd79a8",
    "#0984e3",
    "#e84393",
    "#00cec9",
  ];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash += name.charCodeAt(i);
  return colors[hash % colors.length];
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

const getDateLabel = (timestamp) => {
  if (!timestamp?.toDate) return "";
  const date = timestamp.toDate();
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (date.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (date.toDateString() === yesterday.toDateString()) return "Hier";
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

// ===========================
// COMPOSANT PRINCIPAL
// ===========================
export default function Department() {
  const { user } = useContext(AuthContext);
  const { deptId } = useParams();
  const [messages, setMessages] = useState([]);
  const bottomRef = useRef(null);

  const activeDeptId = deptId || "default";

  // Charger les messages
  useEffect(() => {
    const q = query(
      collection(db, "departmentChats"),
      where("type", "==", "department"),
      where("deptId", "==", activeDeptId),
      orderBy("timestamp", "asc"),
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })));
    });

    return () => unsubscribe();
  }, [activeDeptId]);

  // Scroll automatique vers le bas
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "departmentChats", id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar gauche */}
      <div className="hidden md:block w-1/10 bg-black rounded">
        <Choice />
      </div>

      {/* Zone principale */}
      <div className="flex flex-col flex-1 h-screen">
        {/* En-tête */}
        <div className="flex items-center gap-3 px-4 py-3 bg-[rgb(31,36,46)] border-b border-gray-700 flex-shrink-0">
          <div className="w-9 h-9 rounded-full bg-[#0b525b] flex items-center justify-center text-white text-sm font-bold">
            🏛️
          </div>
          <div>
            <p className="text-white font-semibold text-sm">
              {activeDeptId !== "default" ? activeDeptId : "Département"}
            </p>
            <p className="text-gray-400 text-xs">Chat du département</p>
          </div>
        </div>

        {/* Liste des messages */}
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-3 py-3">
          {/* Message si vide */}
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-500">
              <p className="text-4xl mb-3">💬</p>
              <p className="text-sm">Aucun message dans ce département.</p>
              <p className="text-xs mt-1">Soyez le premier à écrire !</p>
            </div>
          )}

          {messages.map((msg, index, arr) => {
            const isOwn = msg.uid === user?.uid;
            const avatarColor = getColor(msg.auteur || "");
            const initials = getInitials(msg.auteur || "U");

            // Séparateur de date
            const currentLabel = getDateLabel(msg.timestamp);
            const prevLabel =
              index > 0 ? getDateLabel(arr[index - 1].timestamp) : null;
            const showDateSeparator = currentLabel !== prevLabel;

            return (
              <div key={msg.id} className="message-appear">
                {/* SÉPARATEUR DE DATE */}
                {showDateSeparator && currentLabel && (
                  <div className="flex items-center gap-3 my-4">
                    <div className="flex-1 h-px bg-gray-700"></div>
                    <span className="text-xs text-gray-400 bg-[rgb(31,36,46)] px-3 py-1 rounded-full font-medium border border-gray-700">
                      {currentLabel}
                    </span>
                    <div className="flex-1 h-px bg-gray-700"></div>
                  </div>
                )}

                {/* BULLE */}
                <div
                  className={`flex items-end gap-2 mb-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                >
                  {/* Avatar */}
                  {msg.photoURL ? (
                    <img
                      src={msg.photoURL}
                      className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1 border-2 border-gray-700"
                      alt={msg.auteur}
                    />
                  ) : (
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 border-2 border-gray-700"
                      style={{ background: avatarColor }}
                    >
                      {initials}
                    </div>
                  )}

                  {/* Contenu bulle */}
                  <div
                    className={`max-w-[70%] px-4 py-3 rounded-2xl shadow break-words
                    ${
                      isOwn
                        ? "bg-[#0b525b] text-white rounded-br-none"
                        : "bg-[rgb(43,53,66)] text-gray-200 rounded-bl-none"
                    }`}
                  >
                    {/* Nom auteur — seulement messages reçus */}
                    {!isOwn && (
                      <p className="text-xs font-semibold text-teal-400 mb-1">
                        {msg.auteur || "Utilisateur"}
                      </p>
                    )}

                    {/* Media */}
                    {msg.mediaType === "image" && (
                      <img
                        src={msg.mediaUrl}
                        className="w-full rounded-lg mt-1 mb-2 max-h-60 object-cover"
                        alt="media"
                      />
                    )}
                    {msg.mediaType === "video" && (
                      <video controls className="w-full rounded-lg mt-1 mb-2">
                        <source src={msg.mediaUrl} />
                      </video>
                    )}
                    {msg.mediaType === "file" && (
                      <a
                        href={msg.mediaUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-blue-400 underline mt-1 block text-sm"
                      >
                        📎 Télécharger le fichier
                      </a>
                    )}

                    {/* Texte */}
                    {msg.message && (
                      <p className="text-sm leading-relaxed">{msg.message}</p>
                    )}

                    {/* Heure + supprimer */}
                    <div className="flex items-center justify-end mt-1 gap-2">
                      <span className="text-xs text-gray-400">
                        {msg.timestamp?.toDate
                          ? new Date(msg.timestamp.toDate()).toLocaleTimeString(
                              [],
                              {
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : ""}
                      </span>
                      {isOwn && (
                        <button
                          onClick={() => handleDelete(msg.id)}
                          className="text-xs text-red-400 hover:text-red-500 bg-transparent p-0 h-auto leading-none"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Scroll automatique */}
          <div ref={bottomRef} />
        </div>

        {/* Zone d'envoi */}
        <MessageSender
          collectionName="departmentChats"
          type="department"
          deptId={activeDeptId}
        />
      </div>
    </div>
  );
}
