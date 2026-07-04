import React, { useState } from "react";
import { getAuth, updateProfile } from "firebase/auth";
import { db } from "../services/Firebase";
import { doc, updateDoc } from "firebase/firestore";

export default function UploadImage({ onUpload }) {
  const [loading, setLoading] = useState(false);
  const auth = getAuth();

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "photoprofil");
    data.append("cloud_name", "dpjmh4yc9");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpjmh4yc9/image/upload",
        { method: "POST", body: data }
      );
      const cloudinaryData = await res.json();
      const url = cloudinaryData.secure_url;

      // Appelle la fonction du parent pour mettre à jour l'avatar
      if (onUpload) onUpload(url);

      // Met à jour l'avatar dans Firebase Authentication pour persister
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, { photoURL: url });

        // Mettre à jour aussi Firestore
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          photoURL: url,
        });
      }
      setLoading(false);
    } catch (err) {
      console.error("Erreur Cloudinary :", err);
      setLoading(false);
    }
  };

  return (
    <div>
         <input
        id="avatarInput"
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden" 
      />

      {loading && <p>Upload en cours...</p>}
    </div>
  );
}
