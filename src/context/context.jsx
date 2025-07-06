import { createContext, useState } from "react";
import { useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { auth } from "../services/Firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../services/Firebase";

export const AuthContext = createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fullUser = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              photoURL: currentUser.photoURL,
              ...docSnap.data(), // récupère departement, rôle, etc.
            };
            setUser(fullUser);
          } else {
            setUser(currentUser); // fallback au cas où pas de doc
          }
        } catch (error) {
          console.error("Erreur récupération Firestore:", error);
          setUser(currentUser); // fallback si erreur
        }
      } else {
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe(); // clean listener
  }, []);
  // inscription

  const SignUp = async (email, password, userData) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );

    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });

    // 🧠 Enregistrement dans Firestore
    await setDoc(doc(db, "users", userCredential.user.uid), {
      email: userData.email,
      name: userData.name,
      departement: userData.departement,
      niveau: userData.niveau,
      createdAt: new Date().toISOString(),
    });

    return userCredential;
  };

  // connexion
  const Login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  // deconnexion
  const Logout = async () => {
    return auth.signOut();
  };
  const id = {
    user,
    loading,
    SignUp,
    Login,
    Logout,
  };
  return <AuthContext.Provider value={id}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
