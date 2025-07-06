import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { AuthContext } from "../context/context";
import { Link, useNavigate } from "react-router-dom";

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

  // Liste des départements disponibles
  const departements = [
    "Génie Électrique et Informatique Industrielle (GEII)",
    "Génie Industriel et Maintenance (GIM",
    "Génie Mécanique et Productique (GMP)",
    "Génie Thermique et Énergie (GTE)",
    "Génie Civil (GCI)",
    "Génie Informatique (GI)",
    "Génie Logistique et Transport (GLT)",
    "Organisation et Gestion Administrative (OGA)",
    "Gestion des Entreprises et des Administrations (GEA)",
  ];

  // Niveaux d'études
  const niveaux = ["L1", "L2", "L3", "M1", "M2", "Doctorat"];

  const handleSignUp = async (data) => {
  // Validation des champs obligatoires
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

  // Validation du format matricule (exemple: 20I24001)
  const matriculeRegex = /^\d{2}[A-Z]\d{5}$/;
  if (!matriculeRegex.test(data.matricule)) {
    toast.error("Format de matricule invalide (ex: 20I24001)");
    return;
  }

  if (loading) return;

  try {
    setLoading(true);

    // 🔹 Génération automatique d'une photo de profil (pas besoin d'upload)
    const photoURL = `https://ui-avatars.com/api/?name=${encodeURIComponent(data.name)}&background=random`;

    // Données complètes de l'utilisateur
    const userData = {
      email: data.email,
      name: data.name,
      matricule: data.matricule.toUpperCase(),
      departement: data.departement,
      niveau: data.niveau || "L1",
      createdAt: new Date().toISOString(),
      isActive: true,
      photoURL, // ✅ Ajout automatique de la photo
    };

    await SignUp(data.email, data.password, userData);
    navigate("/room");
    toast.success("Inscription réussie ! Bienvenue !");
  } catch (error) {
    console.log(error);
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


  return (
    <>
      <div
        className="min-h-screen py-8 bg-gradient-to-br from-blue-400 to-cyan-400"
        // style={{
        //   backgroundImage: "url('/bg.jpg')",
        //   backgroundSize: 'cover',
        //   backgroundPosition: 'center'
        // }}
      >
        <form
          onSubmit={handleSubmit(handleSignUp)}
          className="bg-white/90 backdrop-blur-sm p-6 rounded-xl shadow-lg w-full max-w-md mx-auto space-y-4"
        >
          <h2 className="text-2xl font-semibold text-center text-gray-800">
            Inscription Étudiante
          </h2>

          {/* Pseudo */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Nom complet"
              {...register("name", {
                required: "Nom obligatoire",
                minLength: {
                  value: 2,
                  message: "Le nom doit contenir au moins 2 caractères",
                },
              })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>
            )}
          </div>

          {/* Matricule */}
          <div className="flex flex-col">
            <input
              type="text"
              placeholder="Matricule (ex: 20J24001)"
              {...register("matricule", {
                required: "Matricule obligatoire",
                pattern: {
                  value: /^\d{2}[A-Z]\d{5}$/,
                  message: "Format invalide (ex: 20I24001)",
                },
              })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 uppercase"
              maxLength="9"
            />
            {errors.matricule && (
              <p className="text-red-500 text-sm mt-1">
                {errors.matricule.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col">
            <input
              type="email"
              placeholder="Email étudiant"
              {...register("email", {
                required: "Email obligatoire",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide",
                },
              })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Département */}
          <div className="flex flex-col">
            <select
              {...register("departement", {
                required: "Veuillez sélectionner votre département",
              })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sélectionnez votre département</option>
              {departements.map((dept, index) => (
                <option key={index} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
            {errors.departement && (
              <p className="text-red-500 text-sm mt-1">
                {errors.departement.message}
              </p>
            )}
          </div>

          {/* Niveau d'études */}
          <div className="flex flex-col">
            <select
              {...register("niveau")}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Niveau d'études (optionnel)</option>
              {niveaux.map((niveau, index) => (
                <option key={index} value={niveau}>
                  {niveau}
                </option>
              ))}
            </select>
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col">
            <input
              type="password"
              placeholder="Mot de passe (min. 8 caractères)"
              {...register("password", {
                required: "Mot de passe obligatoire",
                minLength: {
                  value: 8,
                  message:
                    "Le mot de passe doit contenir au moins 8 caractères",
                },
              })}
              className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Bouton */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg transition duration-200 ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
            } text-white`}
          >
            {loading ? "Inscription en cours..." : "S'inscrire"}
          </button>
        </form>

        {/* Lien vers la page de login */}
        <div className="text-center mt-4">
          <Link
            to="/login"
            className="text-white hover:underline bg-black/50 px-4 py-2 rounded-lg"
          >
            Déjà un compte ? Connecte-toi
          </Link>
        </div>
      </div>
    </>
  );
}
