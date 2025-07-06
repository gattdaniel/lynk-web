import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  serverTimestamp,
  onSnapshot,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import { useContext, useEffect, useState } from "react";
import Department from "../components/departement";
import { AuthContext } from "../context/context";
import { Link } from "react-router-dom";
import InboxList from "../components/InboxList";

// Composant Modal pour afficher profil utilisateur (inchangé)
function ProfileModal({ isOpen, onClose, profileData }) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 max-w-sm w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-4">Profil Utilisateur</h2>
        <div className="space-y-2 text-gray-800">
          <p><strong>Nom complet :</strong> {profileData.displayName || profileData.name || "Non renseigné"}</p>
          <p><strong>Email :</strong> {profileData.email || "Non renseigné"}</p>
          <p><strong>Matricule :</strong> {profileData.matricule || "Non renseigné"}</p>
          <p><strong>Département :</strong> {profileData.departement || "Non renseigné"}</p>
          <p><strong>Niveau :</strong> {profileData.niveau || "Non renseigné"}</p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

export default function Room() {
  const { user } = useContext(AuthContext);

  const [notifications, setNotifications] = useState([]);
  const [message, setMessage] = useState("");
  const [reactions, setReactions] = useState({});

  const [drawerDeptOpen, setDrawerDeptOpen] = useState(false);
  const [drawerInboxOpen, setDrawerInboxOpen] = useState(false); // Nouveau drawer Inbox

  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("type", "==", "global"),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNotifications(data);
    });

    return () => unsubscribe();
  }, []);

  async function fetchProfile() {
    if (!user?.uid) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setProfileData(docSnap.data());
    } else {
      setProfileData(null);
    }
  }

  const openProfileModal = () => {
    fetchProfile();
    setShowModal(true);
  };

  const HandleAdddoc = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await addDoc(collection(db, "notifications"), {
        message: message.trim(),
        timestamp: serverTimestamp(),
        uid: user.uid,
        auteur: user.displayName || "Utilisateur",
        type: "global",
      });
      setMessage("");
    } catch (error) {
      console.log(error);
    }
  };

  const handledelete = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (error) {
      console.log(error);
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
    <>
      {/* Bandeau accueil avec nom cliquable */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-[#0b525b] text-white px-4 py-2 rounded-lg shadow-lg z-10">
        👋 slt{" "}
        <span
          className="text-blue-400 underline cursor-pointer"
          onClick={openProfileModal}
          title="Voir mon profil"
        >
          {user?.displayName || "utilisateur"}
        </span>
      </div>

      {/* Modale profil utilisateur */}
      <ProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        profileData={profileData || {}}
      />

      <div className="flex bg-[rgb(32,75,87)] min-h-screen relative">
        {/* Bouton hamburger gauche (Départements) */}
        <button
          className="sm:hidden absolute top-5 left-4 z-30 p-2 bg-[#0b525b] rounded-md focus:outline-none"
          onClick={() => setDrawerDeptOpen(!drawerDeptOpen)}
          aria-label="Toggle departments menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Bouton hamburger droite (Inbox discussions) */}
        <button
          className="md:hidden absolute top-5 right-4 z-30 p-2 bg-[#0b525b] rounded-md focus:outline-none"
          onClick={() => setDrawerInboxOpen(!drawerInboxOpen)}
          aria-label="Toggle inbox menu"
        >
          <svg
            className="w-6 h-6 text-white"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* Drawer Départements gauche (mobile) */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-[#0b525b] p-4 z-20 transform transition-transform duration-300 ease-in-out
            ${drawerDeptOpen ? "translate-x-0" : "-translate-x-full"} sm:hidden`}
        >
          {/* <button
            className="mb-4 text-white font-bold"
            onClick={() => setDrawerDeptOpen(false)}
            aria-label="Close departments menu"
          >
           
          </button> */}
          <Department />
        </div>

        {/* Drawer Inbox droite (mobile) */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-[#0b525b] p-4 z-20 transform transition-transform duration-300 ease-in-out
            ${drawerInboxOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
        >
          {/* <button
            className="mb-4 text-white font-bold"
            onClick={() => setDrawerInboxOpen(false)}
            aria-label="Close inbox menu"
          >
           
          </button> */}
          <InboxList />
        </div>

        {/* Sidebar fixe desktop gauche */}
        <div className="hidden sm:block w-[20vw] h-screen p-4 bg-[#0b525b]">
          <Department />
        </div>

        {/* Contenu principal */}
        <div className="flex flex-col flex-1 max-w-5xl mx-auto mt-10 mb-10 p-4 h-[85vh]">
          <div className="flex-1 overflow-y-auto flex custom-scrollbar flex-col-reverse space-y-2 space-y-reverse px-2">
            {notifications.map((notif) => {
              const isOwn = notif.uid === user?.uid;
              return (
                <div
                  key={notif.id}
                  className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] p-4 rounded-lg shadow-sm border break-words ${
                      isOwn
                        ? "bg-[#0b525b] text-white rounded-br-none"
                        : "bg-[#204b57] text-gray-200 rounded-bl-none"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-1">
                      <span className="font-semibold">
                        <Link
                          to={`/chat/${notif.uid}`}
                          className="font-semibold hover:underline"
                        >
                          {notif.auteur || "Utilisateur"}
                        </Link>
                      </span>
                      <span className="text-xs text-gray-400">
                        {notif.timestamp?.toDate
                          ? new Date(
                              notif.timestamp.toDate()
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : ""}
                      </span>
                    </div>
                    <p>{notif.message}</p>

                    <div className="flex gap-2 mt-2">
                      {["👍", "❤️", "😂", "🔥"].map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => handleReact(notif.id, emoji)}
                          className="bg-[#204b57] px-2 py-1 rounded-full hover:bg-[#127f8a] text-sm"
                          type="button"
                        >
                          {emoji} {reactions[notif.id]?.[emoji] || 0}
                        </button>
                      ))}
                    </div>

                    {isOwn && (
                      <button
                        onClick={() => handledelete(notif.id)}
                        className="text-xs mt-2 text-red-400 hover:text-red-600"
                      >
                        supprimer
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <form
            onSubmit={HandleAdddoc}
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
              <img src="fleche.png" alt="Ajouter" className="w-5 h-5" />
            </button>
          </form>
        </div>

        {/* Sidebar droite Desktop */}
        <div className="hidden md:flex w-[20vw] p-4 h-[100vh] bg-[#0b525b] overflow-y-auto">
          <InboxList />
        </div>
      </div>
    </>
  );
}
