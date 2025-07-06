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
      console.error(error);
      // Gestion des erreurs spécifiques
      if (error.code === 'auth/user-not-found') {
        toast.error("Aucun compte trouvé avec cette adresse email");
      } else if (error.code === 'auth/wrong-password') {
        toast.error("Mot de passe incorrect");
      } else if (error.code === 'auth/invalid-email') {
        toast.error("Format d'email invalide");
      } else if (error.code === 'auth/too-many-requests') {
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
    <>
      <div
        className="min-h-screen flex items-center justify-center py-8 bg-gradient-to-br from-blue-400 to-cyan-400"
        // style={{
        //   backgroundImage: "url('/bg.jpg')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "center",
        // }}
      >
        <div className="w-full max-w-md">
          <form
            onSubmit={handleSubmit(handleLogin)}
            className="bg-white/90 backdrop-blur-sm shadow-lg rounded-xl p-6 w-full space-y-4"
          >
            <h2 className="text-2xl font-semibold text-center text-gray-800">
              Connexion Étudiante
            </h2>
            <p className="text-center text-gray-600 text-sm mb-6">
              Accédez à votre espace de discussion
            </p>

            {/* Email */}
            <div className="flex flex-col">
              <input
                type="email"
                placeholder="Adresse email"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("email", { 
                  required: "Email obligatoire",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Format d'email invalide"
                  }
                })}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.email.message}
                </p>
              )}
            </div>

            {/* Mot de passe */}
            <div className="flex flex-col">
              <input
                type="password"
                placeholder="Mot de passe"
                className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                {...register("password", {
                  required: "Mot de passe obligatoire",
                  minLength: {
                    value: 8,
                    message: "Minimum 8 caractères",
                  },
                })}
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password.message}
                </p>
              )}
            </div>

            {/* Bouton de connexion */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-lg transition duration-200 ${
                loading 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : "bg-blue-600 hover:bg-blue-700"
              } text-white`}
            >
              {loading ? "Connexion en cours..." : "Se connecter"}
            </button>

            {/* Mot de passe oublié */}
            <div className="text-center">
              <button
                type="button"
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                onClick={() => toast.info("Fonctionnalité bientôt disponible")}
              >
                Mot de passe oublié ?
              </button>
            </div>
          </form>

          {/* Lien vers l'inscription */}
          <div className="text-center mt-4">
            <Link 
              to="/" 
              className="text-white hover:underline bg-black/50 px-4 py-2 rounded-lg inline-block transition duration-200 hover:bg-black/70"
            >
              Pas encore de compte ? Inscris-toi
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}