import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AuthContext } from "../context/context";

export default function LogOut() {
  const navigate = useNavigate();
  const { Logout } = useContext(AuthContext);

  const handleLogout = async () => {
    try {
      await Logout();
      toast.success("Déconnexion réussie !");
      navigate("/");  
    } catch (error) {
      console.error("Erreur de déconnexion :", error);
    }
  };

  return (
    <button onClick={handleLogout}>
      Déconnexion
    </button>
  );
}
