import { useState, useContext } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db } from "../services/Firebase";
import { AuthContext } from "../context/context";
import { MoreHorizontal } from "lucide-react";

export default function MessageSender({
  collectionName = "notifications",
  type = "global",
  chatId = null,
  deptId = null,
}) {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const uploadToCloudinary = async (file, preset) => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", preset);
    data.append("cloud_name", "dpjmh4yc9");

    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dpjmh4yc9/upload",
      { method: "POST", body: data },
    );
    return res.json();
  };

  const handleSendText = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    // ✅ Validation deptId
    let finalDeptId = type === "department" ? deptId || "default" : null;

    const payload = {
      message: message.trim(),
      timestamp: serverTimestamp(),
      uid: user.uid,
      auteur: user.displayName || "Utilisateur",
      photoURL: user.photoURL || null,
      type,
    };

    if (type === "private") {
      payload.chatId = chatId;
      payload.from = user.uid;
      payload.participants = chatId.split("_"); // ← extrait les 2 UIDs
    }
    if (type === "department") payload.deptId = finalDeptId;
    try {
      await addDoc(collection(db, collectionName), payload);
      setMessage("");
    } catch (err) {
      console.error("Erreur envoi message :", err);
    }
  };

  const handleUpload = async (e, mediaType) => {
    const file = e.target.files[0];
    if (!file) return;
    setLoading(true);

    let preset = "";
    if (mediaType === "image") preset = "images_preset";
    else if (mediaType === "video") preset = "videos_preset";
    else preset = "files_preset";

    try {
      const result = await uploadToCloudinary(file, preset);

      let finalDeptId = type === "department" ? deptId || "default" : null;

      const payload = {
        message: "",
        mediaUrl: result.secure_url,
        mediaType,
        timestamp: serverTimestamp(),
        uid: user.uid,
        auteur: user.displayName || "Utilisateur",
        photoURL: user.photoURL || null,
        type,
      };
      if (type === "private") {
        payload.chatId = chatId;
        payload.from = user.uid;
        payload.participants = chatId.split("_");
      }
      await addDoc(collection(db, collectionName), payload);
    } catch (err) {
      console.error("Erreur upload :", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSendText}
      className="flex items-center gap-2 bg-[#203545] p-4 rounded-t-xl shadow-md"
    >
      <input
        type="text"
        placeholder="Entrez un message"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        className="flex-1 px-4 py-2 bg-[#0b525b] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
      />

      <div
        className="relative"
        onMouseEnter={() => setMenuOpen(true)}
        onMouseLeave={() => setMenuOpen(false)}
      >
        <div className="cursor-pointer p-2 bg-[#0b525b] rounded text-white">
          <MoreHorizontal className="w-6 h-6" />
        </div>

        {menuOpen && (
          <div className="absolute bottom-10 right-0 flex flex-col gap-2 bg-[rgb(31,36,46)] p-2 rounded shadow-lg z-50">
            <label
              htmlFor="uploadImage"
              className="cursor-pointer px-3 py-1 bg-[#0b525b] text-white rounded hover:bg-[#127f8a]"
            >
              Image
            </label>
            <label
              htmlFor="uploadVideo"
              className="cursor-pointer px-3 py-1 bg-[#0b525b] text-white rounded hover:bg-[#127f8a]"
            >
              Vidéo
            </label>
            <label
              htmlFor="uploadFile"
              className="cursor-pointer px-3 py-1 bg-[#0b525b] text-white rounded hover:bg-[#127f8a]"
            >
              Fichier
            </label>
          </div>
        )}

        <input
          type="file"
          accept="image/*"
          className="hidden"
          id="uploadImage"
          onChange={(e) => handleUpload(e, "image")}
        />
        <input
          type="file"
          accept="video/*"
          className="hidden"
          id="uploadVideo"
          onChange={(e) => handleUpload(e, "video")}
        />
        <input
          type="file"
          className="hidden"
          id="uploadFile"
          onChange={(e) => handleUpload(e, "file")}
        />
      </div>

      <button
        type="submit"
        className="px-4 py-2 bg-[#0b525b] text-white font-semibold rounded-lg hover:bg-blue-700 transition"
      >
        {loading ? "Envoi..." : "➤"}
      </button>
    </form>
  );
}
