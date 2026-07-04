import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { collection, onSnapshot, orderBy, query, where,} from "firebase/firestore";
import { db } from "../services/Firebase";
import { AuthContext } from "../context/context";
import Choice from "../components/choice";
import MessageSender from "../components/Handlesend";

export default function Department() {
  const { user } = useContext(AuthContext);
  const { deptId } = useParams();
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!deptId) return;

    const q = query(
      collection(db, "notifications"),
      where("type", "==", "department"),
      where("deptId", "==", deptId),
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
  }, [deptId]);

  return (
    <div className="flex h-screen bg-black">
      {/* Sidebar gauche */}
      <div className="w-1/10 bg-black rounded">
        <Choice />
      </div>

      {/* Contenu principal */}
      <div className="flex flex-col flex-1 p-4">
        <div className="flex-1 overflow-y-auto flex flex-col-reverse custom-scrollbar space-y-2 space-y-reverse px-2">
          {messages.map((msg) => {
            const isOwn = msg.uid === user?.uid;
            return (
              <div
                key={msg.id}
                className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[70%] p-3 rounded-lg shadow-sm border break-words ${
                    isOwn
                      ? "bg-[rgb(31,36,46)] text-white rounded-br-none"
                      : "bg-[rgb(31,36,46)] text-gray-200 rounded-bl-none"
                  }`}
                >
                  <p>{msg.message}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Formulaire d'envoi de messages */}
        <MessageSender
          collectionName="notifications"
          type="department"
          deptId={deptId}
        />
      </div>
    </div>
  );
}

