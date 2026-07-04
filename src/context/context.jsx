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
          // Marquer comme en ligne
          await setDoc(
            doc(db, "users", currentUser.uid),
            {
              online: true,
              lastSeen: new Date().toISOString(),
            },
            { merge: true },
          );

          const docRef = doc(db, "users", currentUser.uid);
          const docSnap = await getDoc(docRef);

          if (docSnap.exists()) {
            const fullUser = {
              uid: currentUser.uid,
              email: currentUser.email,
              displayName: currentUser.displayName,
              ...docSnap.data(),
              photoURL: currentUser.photoURL,
            };
            setUser(fullUser);
          } else {
            setUser(currentUser);
          }
        } catch (error) {
          console.error("Erreur récupération Firestore:", error);
          setUser(currentUser);
        }
      } else {
        // Marquer comme hors ligne
        if (auth.currentUser) {
          await setDoc(
            doc(db, "users", auth.currentUser.uid),
            {
              online: false,
              lastSeen: new Date().toISOString(),
            },
            { merge: true },
          );
        }
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  // inscription

  const SignUp = async (email, password, userData) => {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    await updateProfile(userCredential.user, {
      displayName: userData.name,
    });

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
    setUser,
    SignUp,
    Login,
    Logout,
  };
  return <AuthContext.Provider value={id}>{children}</AuthContext.Provider>;
}
export default AuthProvider;
