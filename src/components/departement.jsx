import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/context";

export default function Department() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const departements = [
    "Génie Électrique et Informatique Industrielle (GEII)",
    "Génie Industriel et Maintenance (GIM)",
    "Génie Mécanique et Productique (GMP)",
    "Génie Thermique et Énergie (GTE)",
    "Génie Civil (GCI)",
    "Génie Informatique (GI)",
    "Génie Logistique et Transport (GLT)",
    "Organisation et Gestion Administrative (OGA)",
    "Gestion des Entreprises et des Administrations (GEA)",
  ];

  const handleClick = (dept) => {
    if (!user) {
      alert("Veuillez vous connecter.");
      return;
    }

    if (user.departement === dept) {
      const encodedDept = encodeURIComponent(dept);
      navigate(`/departement/${encodedDept}`);
    } else {
      alert("⛔ Accès refusé : ce n’est pas votre département !");
    }
  };

  return (
    <div className="w-full md:w-[20vw] space-y-2 overflow-y-auto custom-scrollbar p-4 h-[100vh]">
      <div className="fixed bg-[#0b525b] h-[8vh] top-0 flex items-center   md:w-[20vw] text-white">
        <h1 className="text-center text-xl font-bold">Salons privés</h1>
      </div>

      <div className="pt-[10vh] space-y-4">
        {departements.map((dept, index) => (
          <div
            key={index}
            className="cursor-pointer flex-1 px-4 py-2 h-[15vh] text-center bg-[#0b525b] rounded-lg text-white hover:bg-[#127f8a] transition"
            onClick={() => handleClick(dept)}
          >
            <p>{dept}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
