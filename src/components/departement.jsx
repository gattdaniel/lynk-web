import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";

const departements = [
  {
    nom: "Génie Électrique et Informatique Industrielle",
    sigle: "GEII",
    icon: "⚡",
  },
  { nom: "Génie Industriel et Maintenance", sigle: "GIM", icon: "⚙️" },
  { nom: "Génie Mécanique et Productique", sigle: "GMP", icon: "🔧" },
  { nom: "Génie Thermique et Énergie", sigle: "GTE", icon: "🔥" },
  { nom: "Génie Civil", sigle: "GCI", icon: "🏗️" },
  { nom: "Génie Informatique", sigle: "GI", icon: "💻" },
  { nom: "Génie Logistique et Transport", sigle: "GLT", icon: "🚛" },
  { nom: "Organisation et Gestion Administrative", sigle: "OGA", icon: "📋" },
  {
    nom: "Gestion des Entreprises et des Administrations",
    sigle: "GEA",
    icon: "🏢",
  },
];

export default function DepartementList() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleClick = (dept) => {
    if (!user) return;
    const fullName = `${dept.nom} (${dept.sigle})`;
    if (user.departement === fullName) {
      navigate(`/departement/${encodeURIComponent(fullName)}`);
    }
  };

  const isMyDept = (dept) => {
    const fullName = `${dept.nom} (${dept.sigle})`;
    return user?.departement === fullName;
  };

  return (
    <div className="w-full md:w-[20vw] bg-[rgb(31,36,46)] h-screen overflow-y-auto flex flex-col custom-scrollbar">
      {/* EN-TÊTE */}
      <div className="px-4 py-4 border-b border-gray-700 sticky top-0 bg-[rgb(31,36,46)] z-10 flex-shrink-0">
        <h2 className="text-base font-bold text-white">🏛️ Départements</h2>
        <p className="text-xs text-gray-400 mt-0.5">
          {departements.length} départements — ENSPD
        </p>
      </div>

      {/* LISTE */}
      <div className="flex flex-col gap-1 p-3">
        {departements.map((dept, index) => {
          const mine = isMyDept(dept);
          return (
            <div
              key={index}
              onClick={() => handleClick(dept)}
              className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200
                ${
                  mine
                    ? "bg-[#0b525b] cursor-pointer hover:bg-[#127f8a] shadow-lg shadow-teal-900/20"
                    : "bg-[rgb(43,53,66)] cursor-not-allowed opacity-60"
                }`}
            >
              {/* Icône */}
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg flex-shrink-0
                ${mine ? "bg-[#127f8a]" : "bg-[rgb(31,36,46)]"}`}
              >
                {dept.icon}
              </div>

              {/* Infos */}
              <div className="flex-1 overflow-hidden">
                <div className="flex items-center gap-2">
                  <p
                    className={`text-xs font-bold ${mine ? "text-white" : "text-gray-400"}`}
                  >
                    {dept.sigle}
                  </p>
                  {mine && (
                    <span className="text-xs bg-[#00c6a0] text-[#0b525b] px-2 py-0.5 rounded-full font-bold">
                      Mon dept
                    </span>
                  )}
                </div>
                <p
                  className={`text-xs truncate mt-0.5 ${mine ? "text-gray-200" : "text-gray-500"}`}
                >
                  {dept.nom}
                </p>
              </div>

              {/* Flèche si accessible */}
              {mine && (
                <span className="text-teal-400 text-sm flex-shrink-0">→</span>
              )}

              {/* Cadenas si pas accessible */}
              {!mine && (
                <span className="text-gray-600 text-sm flex-shrink-0">🔒</span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
