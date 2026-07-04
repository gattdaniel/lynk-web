import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../services/Firebase";
import { Mail, User, IdCard, Building2, GraduationCap } from "lucide-react";

// Helper — initiales depuis le nom
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

export default function UserInfo({ contactId }) {
  const [contact, setContact] = useState(null);

  // onSnapshot pour statut en temps réel
  useEffect(() => {
    if (!contactId) return;

    const docRef = doc(db, "users", contactId);
    const unsubscribe = onSnapshot(docRef, (docSnap) => {
      if (docSnap.exists()) {
        setContact(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [contactId]);

  if (!contact)
    return (
      <div className="flex items-center justify-center w-full h-full text-gray-400 text-sm">
        Chargement...
      </div>
    );

  const infos = [
    { icon: Mail, label: "Email", value: contact?.email },
    { icon: User, label: "Nom", value: contact?.displayName || contact?.name },
    { icon: IdCard, label: "Matricule", value: contact?.matricule },
    { icon: Building2, label: "Département", value: contact?.departement },
    { icon: GraduationCap, label: "Niveau", value: contact?.niveau },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 py-4 overflow-y-auto">
      {/* AVATAR + POINT STATUT */}
      <div className="relative">
        {contact?.photoURL ? (
          <img
            src={contact.photoURL}
            alt="avatar"
            className="w-20 h-20 rounded-full object-cover border-4 border-[#0b525b] shadow-lg"
          />
        ) : (
          <div className="w-20 h-20 rounded-full bg-[#0b525b] text-white flex items-center justify-center text-xl font-bold border-4 border-[#0b525b] shadow-lg">
            {getInitials(contact?.displayName || contact?.name || "")}
          </div>
        )}

        {/* Point vert/gris selon statut online */}
        <div
          className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[rgb(31,36,46)] ${
            contact?.online ? "bg-green-500" : "bg-gray-500"
          }`}
        ></div>
      </div>

      {/* NOM + STATUT TEXTE */}
      <div className="text-center">
        <p className="text-white font-semibold text-sm">
          {contact?.displayName || contact?.name || "Utilisateur"}
        </p>
        <p
          className={`text-xs mt-0.5 font-medium ${contact?.online ? "text-green-400" : "text-gray-500"}`}
        >
          {contact?.online ? "● En ligne" : "● Hors ligne"}
        </p>
        <p className="text-teal-400 text-xs mt-0.5">
          {contact?.departement || ""}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">{contact?.niveau || ""}</p>
      </div>

      {/* SÉPARATEUR */}
      <div className="w-full h-px bg-gray-700"></div>

      {/* INFOS */}
      <div className="w-full flex flex-col gap-2 px-2">
        {infos.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[rgb(43,53,66)] hover:bg-[#0b525b] transition"
          >
            <Icon className="w-4 h-4 text-teal-400 flex-shrink-0" />
            <div className="overflow-hidden">
              <p className="text-xs text-gray-400 leading-none mb-0.5">
                {label}
              </p>
              <p className="text-white text-xs font-medium truncate">
                {value || "Non renseigné"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
