import { useContext, useState, useEffect } from "react";
import { AuthContext } from "../context/context";
import {
  Mail,
  User,
  IdCard,
  GraduationCap,
  Building2,
  LogOut,
} from "lucide-react";
import UploadImage from "../components/Photoprofil";

// Helper — initiales depuis le nom
const getInitials = (name = "") =>
  name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U";

export default function Profil() {
  const { user, Logout } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState(user?.photoURL || null);

  useEffect(() => {
    setAvatarUrl(user?.photoURL || null);
  }, [user?.photoURL]);

  const infos = [
    { icon: Mail, label: "Email", value: user?.email },
    { icon: User, label: "Nom", value: user?.displayName || user?.name },
    { icon: IdCard, label: "Matricule", value: user?.matricule },
    { icon: Building2, label: "Département", value: user?.departement },
    { icon: GraduationCap, label: "Niveau", value: user?.niveau },
  ];

  return (
    <div className="w-full h-full flex flex-col items-center gap-4 py-4 overflow-y-auto">
      {/* PHOTO DE PROFIL */}
      <div className="relative">
        <label htmlFor="avatarInput" className="cursor-pointer block">
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt="avatar"
              className="w-20 h-20 rounded-full object-cover border-4 border-[#0b525b] shadow-lg"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-[#0b525b] text-white flex items-center justify-center text-xl font-bold border-4 border-[#0b525b] shadow-lg">
              {getInitials(user?.displayName || user?.name || "")}
            </div>
          )}
        </label>

        {/* Point vert — en ligne */}
       <div className={`absolute bottom-1 right-1 w-4 h-4 rounded-full border-2 border-[rgb(31,36,46)] ${user?.online ? "bg-green-500" : "bg-gray-500"}`}></div>

        {/* Upload invisible */}
        <UploadImage onUpload={(url) => setAvatarUrl(url)} />
      </div>

      {/* NOM VISIBLE DIRECTEMENT */}
      <div className="text-center">
        <p className="text-white font-semibold text-sm">
          {user?.displayName || user?.name || "Utilisateur"}
        </p>
        <p className="text-teal-400 text-xs mt-0.5">
          {user?.departement || "Département non renseigné"}
        </p>
        <p className="text-gray-500 text-xs mt-0.5">{user?.niveau || ""}</p>
      </div>

      {/* SÉPARATEUR */}
      <div className="w-full h-px bg-gray-700"></div>

      {/* INFOS AVEC ICÔNES */}
      <div className="w-full flex flex-col gap-2 px-2">
        {infos.map(({ icon: Icon, label, value }) => (
          <div
            key={label}
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[rgb(43,53,66)] hover:bg-[#0b525b] transition group"
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

      {/* SÉPARATEUR */}
      {/* <div className="w-full h-px bg-gray-700"></div> */}

      {/* BOUTON DÉCONNEXION */}
      {/* <button
        onClick={Logout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-900 hover:bg-red-700 text-red-300 hover:text-white transition text-xs font-semibold w-full justify-center"
      >
        <LogOut className="w-4 h-4" />
        Se déconnecter
      </button> */}
    </div>
  );
}
