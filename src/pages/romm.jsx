import {
  collection,
  deleteDoc,
  doc,
  orderBy,
  query,
  onSnapshot,
  where,
  getDoc,
} from "firebase/firestore";
import { db } from "../services/Firebase";
import { useContext, useEffect, useState, useRef } from "react";
import Department from "../components/departement";
import { AuthContext } from "../context/context";
import { Link } from "react-router-dom";
import InboxList from "../components/InboxList";
import Profil from "../components/Profil";
import Choice from "../components/choice";
import MessageSender from "../components/Handlesend";

// ===========================
// HELPER — Couleur unique par nom
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

// ===========================
// HELPER — Initiales depuis le nom
// ===========================
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

// ===========================
// HELPER — Label de date
// ===========================
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
// MODALE PROFIL
// ===========================
function ProfileModal({ isOpen, onClose, profileData }) {
  if (!isOpen) return null;
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-[rgb(31,36,46)] text-white rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-gray-700"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-xl font-bold mb-4 text-teal-400">
          Profil Utilisateur
        </h2>
        <div className="space-y-3 text-sm text-gray-300">
          <p>
            <span className="text-white font-semibold">Nom complet :</span>{" "}
            {profileData.displayName || profileData.name || "Non renseigné"}
          </p>
          <p>
            <span className="text-white font-semibold">Email :</span>{" "}
            {profileData.email || "Non renseigné"}
          </p>
          <p>
            <span className="text-white font-semibold">Matricule :</span>{" "}
            {profileData.matricule || "Non renseigné"}
          </p>
          <p>
            <span className="text-white font-semibold">Département :</span>{" "}
            {profileData.departement || "Non renseigné"}
          </p>
          <p>
            <span className="text-white font-semibold">Niveau :</span>{" "}
            {profileData.niveau || "Non renseigné"}
          </p>
        </div>
        <button
          onClick={onClose}
          className="mt-6 w-full px-4 py-2 bg-[#0b525b] text-white rounded-lg hover:bg-[#127f8a] transition"
        >
          Fermer
        </button>
      </div>
    </div>
  );
}

// ===========================
// COMPOSANT PRINCIPAL
// ===========================
export default function Room() {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [drawerDeptOpen, setDrawerDeptOpen] = useState(false);
  const [drawerInboxOpen, setDrawerInboxOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [profileData, setProfileData] = useState(null);

  // Ref pour le scroll automatique vers le bas
  const bottomRef = useRef(null);

  // Charger les messages
  useEffect(() => {
    const q = query(
      collection(db, "notifications"),
      where("type", "==", "global"),
      orderBy("timestamp", "asc"), // asc pour avoir les messages du plus ancien au plus récent
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setNotifications(
        snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() })),
      );
    });
    return () => unsubscribe();
  }, []);

  // Scroll automatique vers le bas à chaque nouveau message
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [notifications]);

  // Charger le profil
  const fetchProfile = async () => {
    if (!user?.uid) return;
    const docRef = doc(db, "users", user.uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) setProfileData(docSnap.data());
    else setProfileData(null);
  };

  const openProfileModal = () => {
    fetchProfile();
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "notifications", id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <ProfileModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        profileData={profileData || {}}
      />

      <div className="flex bg-black h-screen relative">
        {/* Hamburger gauche — Départements */}
        <button
          className="sm:hidden absolute top-5 left-4 z-30 p-2 bg-[#0b525b] rounded-md"
          onClick={() => setDrawerDeptOpen(!drawerDeptOpen)}
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

        {/* Hamburger droite — Inbox */}
        <button
          className="md:hidden absolute top-5 right-4 z-30 p-2 bg-[#0b525b] rounded-md"
          onClick={() => setDrawerInboxOpen(!drawerInboxOpen)}
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

        {/* Drawer Départements mobile */}
        <div
          className={`fixed top-0 left-0 h-full w-64 p-4 z-20 bg-[rgb(31,36,46)] transform transition-transform duration-300 ease-in-out ${drawerDeptOpen ? "translate-x-0" : "-translate-x-full"} sm:hidden`}
        >
          <Department />
        </div>

        {/* Drawer Inbox mobile */}
        <div
          className={`fixed top-0 right-0 h-full w-64 p-4 z-20 bg-[rgb(31,36,46)] transform transition-transform duration-300 ease-in-out ${drawerInboxOpen ? "translate-x-0" : "translate-x-full"} md:hidden`}
        >
          <InboxList />
        </div>

        {/* Sidebar desktop gauche */}
        <div className="hidden md:block w-1/10 bg-black rounded">
          <Choice />
        </div>

        {/* Zone principale chat */}
        <div className="flex flex-col flex-1 max-w-5xl mx-auto h-screen">
          {/* Salutation en haut */}
          <div className="flex justify-center mt-4 mb-2">
            <div className="bg-[rgb(43,53,66)] text-white px-4 py-1 rounded-lg shadow-lg text-sm">
              salut{" "}
              <span
                className="cursor-pointer font-semibold text-teal-400 hover:underline"
                onClick={openProfileModal}
                title="Voir mon profil"
              >
                {user?.displayName || "utilisateur"}
              </span>{" "}
              👋
            </div>
          </div>

          {/* Liste des messages */}
          <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-3 mt-2 mb-2">
            {notifications.map((notif, index, arr) => {
              const isOwn = notif.uid === user?.uid;
              const avatarColor = getColor(notif.auteur || "");
              const initials = getInitials(notif.auteur || "U");

              // Séparateur de date
              const currentLabel = getDateLabel(notif.timestamp);
              const prevLabel =
                index > 0 ? getDateLabel(arr[index - 1].timestamp) : null;
              const showDateSeparator = currentLabel !== prevLabel;

              return (
                <div key={notif.id}  className="message-appear">
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

                  {/* BULLE DE MESSAGE */}
                  <div
                    className={`flex items-end gap-2 mb-2 ${isOwn ? "flex-row-reverse" : "flex-row"}`}
                  >
                    {/* Avatar */}
                    {notif.photoURL ? (
                      <img
                        src={notif.photoURL}
                        className="w-8 h-8 rounded-full object-cover flex-shrink-0 mb-1 border-2 border-gray-700"
                        alt={notif.auteur}
                      />
                    ) : (
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 mb-1 border-2 border-gray-700"
                        style={{ background: avatarColor }}
                      >
                        {initials}
                      </div>
                    )}

                    {/* Contenu de la bulle */}
                    <div
                      className={`max-w-[70%] px-4 py-3 rounded-2xl shadow break-words
                        ${
                          isOwn
                            ? "bg-[#0b525b] text-white rounded-br-none"
                            : "bg-[rgb(43,53,66)] text-gray-200 rounded-bl-none"
                        }`}
                    >
                      {/* Nom de l'auteur — seulement pour les messages des autres */}
                      {!isOwn && (
                        <Link
                          to={`/chat/${notif.uid}`}
                          className="text-xs font-semibold text-teal-400 hover:underline block mb-1"
                        >
                          {notif.auteur || "Utilisateur"}
                        </Link>
                      )}

                      {/* Media */}
                      {notif.mediaType === "image" && (
                        <img
                          src={notif.mediaUrl}
                          className="w-full rounded-lg mt-1 mb-2 max-h-60 object-cover"
                          alt="media"
                        />
                      )}
                      {notif.mediaType === "video" && (
                        <video controls className="w-full rounded-lg mt-1 mb-2">
                          <source src={notif.mediaUrl} />
                        </video>
                      )}
                      {notif.mediaType === "file" && (
                        <a
                          href={notif.mediaUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-blue-400 underline mt-1 block text-sm"
                        >
                          📎 Télécharger le fichier
                        </a>
                      )}

                      {/* Texte du message */}
                      {notif.message && (
                        <p className="text-sm leading-relaxed">
                          {notif.message}
                        </p>
                      )}

                      {/* Heure + bouton supprimer */}
                      <div className="flex items-center justify-end mt-1 gap-2">
                        <span className="text-xs text-gray-400">
                          {notif.timestamp?.toDate
                            ? new Date(
                                notif.timestamp.toDate(),
                              ).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })
                            : ""}
                        </span>
                        {isOwn && (
                          <button
                            onClick={() => handleDelete(notif.id)}
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

            {/* Div invisible pour le scroll automatique */}
            <div ref={bottomRef} />
          </div>

          {/* Zone d'envoi de message */}
          <MessageSender collectionName="notifications" type="global" />
        </div>

        {/* Sidebar desktop droite */}
        <div className="hidden md:flex border-l sm:block w-[20vw] p-4 h-screen bg-[rgb(31,36,46)]">
          <Profil />
        </div>
      </div>
    </>
  );
}
