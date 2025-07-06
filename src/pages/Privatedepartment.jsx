import { Link, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  query,
  where,
  orderBy,
  serverTimestamp,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/context";
import InboxList from "../components/InboxList";

export default function DepartmentPage() {
  const { nom } = useParams();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [reactions, setReactions] = useState({});

  const decodedDept = decodeURIComponent(nom);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("departement", "==", decodedDept),
      where("type", "==", "departement"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(data);
    });

    return () => unsubscribe();
  }, [decodedDept]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    try {
      await addDoc(collection(db, "notifications"), {
        message: message.trim(),
        timestamp: serverTimestamp(),
        departement: decodedDept,
        auteur: user.displayName || "Anonyme",
        uid: user.uid,
        type: "departement",
      });
      setMessage("");
    } catch (err) {
      console.log(err);
    }
  };

  const handleReact = (messageId, emoji) => {
    setReactions((prev) => {
      const current = prev[messageId] || {};
      const count = current[emoji] || 0;
      return {
        ...prev,
        [messageId]: {
          ...current,
          [emoji]: count + 1,
        },
      };
    });
  };

  return (
    <div className="flex bg-[#204b57] min-h-screen relative">
      {/* Sidebar droite : Inbox */}
      <div className="hidden md:flex w-[20vw] p-4 h-[100vh] bg-[#0b525b] overflow-y-auto">
        <InboxList />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 max-w-5xl mx-auto mt-10 mb-10 p-4 h-[85vh]">
        <div className="text-white font-bold text-xl mb-4">
          🧑‍🏫 Salon du département : {decodedDept}
        </div>

        <div className="flex-1 overflow-y-auto flex flex-col-reverse space-y-2 space-y-reverse px-2 custom-scrollbar">
          {messages.map((msg) => {
            const isOwn = msg.uid === user?.uid;
            return (
              <div
                key={msg.id}
                className={`w-full flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[75%] p-4 rounded-xl shadow-md break-words ${
                    isOwn
                      ? "bg-[#0b525b] text-white rounded-br-none"
                      : "bg-[#204b57] text-gray-200 rounded-bl-none"
                  }`}
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-semibold">
                      <Link
                        to={`/chat/${msg.uid}`}
                        className="hover:underline"
                      >
                        {msg.auteur || "Utilisateur"}
                      </Link>
                    </span>
                    <span className="text-xs text-gray-400">
                      {msg.timestamp?.toDate
                        ? new Date(msg.timestamp.toDate()).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm">{msg.message}</p>

                  <div className="flex gap-2 mt-2">
                    {["👍", "❤️", "😂", "🔥"].map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleReact(msg.id, emoji)}
                        className="bg-[#0b525b] px-2 py-1 rounded-full hover:bg-[#127f8a] text-sm text-white"
                      >
                        {emoji} {reactions[msg.id]?.[emoji] || 0}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulaire d'envoi */}
        <form
          onSubmit={sendMessage}
          className="fixed bottom-0 left-[50%] transform -translate-x-1/2 w-full max-w-3xl flex items-center gap-2 bg-[#204b57] p-4 rounded-t-xl shadow-md z-20"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Écris un message..."
            className="flex-1 px-4 py-2 bg-[#0b525b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#0b525b] text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            <img src="/fleche.png" alt="Envoyer" className="w-5 h-5" />
          </button>
        </form>
      </div>
    </div>
  );
}
