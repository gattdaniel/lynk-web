import { useParams } from "react-router-dom";
import {
  collection,
  addDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/context";
import InboxList from "../components/InboxList";

export default function PrivateChat() {
  const { user } = useContext(AuthContext);
  const { uid } = useParams();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const chatId = user ? [user.uid, uid].sort().join("_") : null;

  useEffect(() => {
    if (!chatId) return;

    const q = query(
      collection(db, "privateChats"),
      where("chatId", "==", chatId),
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
  }, [chatId]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim() || !user) return;

    await addDoc(collection(db, "privateChats"), {
      from: user.uid,
      to: uid,
      message: message.trim(),
      timestamp: serverTimestamp(),
      chatId,
      participants: [user.uid, uid],
    });

    setMessage("");
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "privateChats", id));
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  if (!user) return <div>Chargement...</div>;

  return (
    <div className="flex bg-[#204b57] min-h-screen relative">
      {/* Sidebar droite - Inbox */}
      <div className="hidden md:flex w-[20vw] p-4 h-[100vh] bg-[#0b525b] overflow-y-auto">
        <InboxList />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 max-w-5xl mx-auto mt-10 mb-10 p-4 h-[85vh]">
        <div className="text-white font-bold text-xl mb-4 text-center">
          👤 Discussion Privée
        </div>

        {/* Zone des messages */}
        <div className="flex-1 overflow-y-auto flex flex-col-reverse custom-scrollbar space-y-2 space-y-reverse px-2">
          {messages.map((msg) => {
            const isOwn = msg.from === user.uid;
            return (
              <div key={msg.id} className={`flex ${isOwn ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm border break-words ${
                    isOwn
                      ? "bg-[#0b525b] text-white rounded-br-none"
                      : "bg-[#204b57] text-gray-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>
                  {isOwn && (
                    <button
                      onClick={() => handleDelete(msg.id)}
                      className="text-xs mt-2 text-red-300 hover:text-red-500"
                    >
                      supprimer
                    </button>
                  )}
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
            placeholder="Entrez un message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
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
