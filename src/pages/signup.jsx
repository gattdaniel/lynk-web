import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../context/context";
import { Link, useNavigate } from "react-router-dom";

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

const niveaux = ["L1", "L2", "L3", "M1", "M2", "Doctorat"];

export default function Signup() {
  const { SignUp } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm();

  const handleSignUp = async (data) => {
    if (
      !data.email ||
      !data.password ||
      !data.name ||
      !data.matricule ||
      !data.departement
    ) {
      toast.error("Veuillez remplir tous les champs obligatoires");
      return;
    }

    const matriculeRegex = /^\d{2}[A-Z]\d{5}$/;
    if (!matriculeRegex.test(data.matricule)) {
      toast.error("Format de matricule invalide (ex: 20I24001)");
      return;
    }

    if (loading) return;

    try {
      setLoading(true);
      const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=0b525b&color=ffffff&bold=true`;

      const userData = {
        email: data.email,
        name: data.name,
        matricule: data.matricule.toUpperCase(),
        departement: data.departement,
        niveau: data.niveau || "L1",
        createdAt: new Date().toISOString(),
        isActive: true,
        photoURL,
      };

      await SignUp(data.email, data.password, userData);
      navigate("/room");
      toast.success("Inscription réussie ! Bienvenue !");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        toast.error("Cette adresse email est déjà utilisée");
      } else if (error.code === "auth/weak-password") {
        toast.error("Le mot de passe est trop faible");
      } else {
        toast.error("Erreur lors de l'inscription");
      }
    } finally {
      setLoading(false);
    }
    reset();
  };

  // Style commun pour les inputs
  const inputClass =
    "bg-[rgb(43,53,66)] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0b525b] focus:ring-1 focus:ring-[#0b525b] transition text-sm w-full";
  const labelClass = "text-xs text-gray-400 font-medium";

  return (
    <div className="min-h-screen flex items-start justify-center bg-black px-4 py-8 overflow-y-auto">
      <div className="w-full max-w-md">
        {/* LOGO + TITRE */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 mb-4">
            <img
              src="/logo.svg"
              alt="Link logo"
              className="w-full h-full object-contain"
            />
          </div>
          <h1 className="text-2xl font-bold text-white">Créer un compte</h1>
          <p className="text-gray-400 text-sm mt-1">
            Rejoignez votre espace étudiant ENSPD
          </p>
        </div>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="bg-[rgb(31,36,46)] rounded-2xl p-6 space-y-4 border border-gray-700 shadow-2xl"
        >
          {/* Nom complet */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Nom complet *</label>
            <input
              type="text"
              placeholder="Jean-Paul Mbida"
              className={inputClass}
              {...register("name", {
                required: "Nom obligatoire",
                minLength: { value: 2, message: "Minimum 2 caractères" },
              })}
            />
            {errors.name && (
              <p className="text-red-400 text-xs">{errors.name.message}</p>
            )}
          </div>

          {/* Matricule */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Matricule *</label>
            <input
              type="text"
              placeholder="ex: 22I00690"
              className={`${inputClass} uppercase`}
              maxLength="9"
              {...register("matricule", {
                required: "Matricule obligatoire",
                pattern: {
                  value: /^\d{2}[A-Z]\d{5}$/,
                  message: "Format invalide (ex: 20I24001)",
                },
              })}
            />
            {errors.matricule && (
              <p className="text-red-400 text-xs">{errors.matricule.message}</p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Adresse email *</label>
            <input
              type="email"
              placeholder="exemple@enspd.univ-douala.cm"
              className={inputClass}
              {...register("email", {
                required: "Email obligatoire",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs">{errors.email.message}</p>
            )}
          </div>

          {/* Département */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Département *</label>
            <select
              className={inputClass}
              {...register("departement", {
                required: "Veuillez sélectionner votre département",
              })}
            >
              <option value="" className="bg-[rgb(31,36,46)]">
                Sélectionnez votre département
              </option>
              {departements.map((dept, index) => (
                <option key={index} value={dept} className="bg-[rgb(31,36,46)]">
                  {dept}
                </option>
              ))}
            </select>
            {errors.departement && (
              <p className="text-red-400 text-xs">
                {errors.departement.message}
              </p>
            )}
          </div>

          {/* Niveau */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Niveau d'études</label>
            <select className={inputClass} {...register("niveau")}>
              <option value="" className="bg-[rgb(31,36,46)]">
                Sélectionnez votre niveau
              </option>
              {niveaux.map((niveau, index) => (
                <option
                  key={index}
                  value={niveau}
                  className="bg-[rgb(31,36,46)]"
                >
                  {niveau}
                </option>
              ))}
            </select>
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1">
            <label className={labelClass}>Mot de passe *</label>
            <input
              type="password"
              placeholder="Minimum 8 caractères"
              className={inputClass}
              {...register("password", {
                required: "Mot de passe obligatoire",
                minLength: { value: 8, message: "Minimum 8 caractères" },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs">{errors.password.message}</p>
            )}
          </div>

          {/* Bouton inscription */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition duration-200 mt-2
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-[#0b525b] hover:bg-[#127f8a] text-white shadow-lg shadow-teal-900/30"
              }`}
          >
            {loading ? "Inscription en cours..." : "Créer mon compte"}
          </button>
        </form>

        {/* Lien connexion */}
        <div className="text-center mt-6">
          <Link
            to="/login"
            className="text-gray-400 hover:text-teal-400 text-sm transition"
          >
            Déjà un compte ?{" "}
            <span className="text-teal-400 font-semibold hover:underline">
              Connecte-toi
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
