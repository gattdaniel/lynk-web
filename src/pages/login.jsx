import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { AuthContext } from "../context/context";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

export default function Login() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();
  const { Login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data) => {
    if (!data.email || !data.password) {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
    if (loading) return;
    try {
      setLoading(true);
      await Login(data.email, data.password);
      navigate("/room");
      toast.success("Connexion réussie ! Bienvenue !");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        toast.error("Aucun compte trouvé avec cette adresse email");
      } else if (error.code === "auth/wrong-password") {
        toast.error("Mot de passe incorrect");
      } else if (error.code === "auth/invalid-email") {
        toast.error("Format d'email invalide");
      } else if (error.code === "auth/too-many-requests") {
        toast.error("Trop de tentatives. Réessayez plus tard");
      } else {
        toast.error("Erreur de connexion. Vérifiez vos identifiants");
      }
    } finally {
      setLoading(false);
    }
    reset();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      {/* CARTE */}
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
          <h1 className="text-2xl font-bold text-white">Bon retour !</h1>
          <p className="text-gray-400 text-sm mt-1">
            Connectez-vous à votre espace étudiant
          </p>
        </div>

        {/* FORMULAIRE */}
        <form
          onSubmit={handleSubmit(handleLogin)}
          className="bg-[rgb(31,36,46)] rounded-2xl p-6 space-y-4 border border-gray-700 shadow-2xl"
        >
          {/* Email */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">
              Adresse email
            </label>
            <input
              type="email"
              placeholder="exemple@enspd.univ-douala.cm"
              className="bg-[rgb(43,53,66)] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0b525b] focus:ring-1 focus:ring-[#0b525b] transition text-sm"
              {...register("email", {
                required: "Email obligatoire",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "Format d'email invalide",
                },
              })}
            />
            {errors.email && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Mot de passe */}
          <div className="flex flex-col gap-1">
            <label className="text-xs text-gray-400 font-medium">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="bg-[rgb(43,53,66)] border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#0b525b] focus:ring-1 focus:ring-[#0b525b] transition text-sm"
              {...register("password", {
                required: "Mot de passe obligatoire",
                minLength: {
                  value: 8,
                  message: "Minimum 8 caractères",
                },
              })}
            />
            {errors.password && (
              <p className="text-red-400 text-xs mt-0.5">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Mot de passe oublié */}
          <div className="text-right">
            <button
              type="button"
              className="text-xs text-teal-400 hover:text-teal-300 transition bg-transparent p-0"
              onClick={() => toast.info("Fonctionnalité bientôt disponible")}
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Bouton connexion */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition duration-200
              ${
                loading
                  ? "bg-gray-600 cursor-not-allowed text-gray-400"
                  : "bg-[#0b525b] hover:bg-[#127f8a] text-white shadow-lg shadow-teal-900/30"
              }`}
          >
            {loading ? "Connexion en cours..." : "Se connecter"}
          </button>
        </form>

        {/* Lien inscription */}
        <div className="text-center mt-6">
          <Link
            to="/"
            className="text-gray-400 hover:text-teal-400 text-sm transition"
          >
            Pas encore de compte ?{" "}
            <span className="text-teal-400 font-semibold hover:underline">
              Inscris-toi
            </span>
          </Link>
        </div>
      </div>
    </div>
  );
}
