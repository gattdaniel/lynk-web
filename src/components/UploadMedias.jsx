import { useState } from "react";

export default function UploadMessage({ onSend }) {
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setLoading(true);

    // Détection automatique du type
    const isImage = file.type.startsWith("image/");
    const isVideo = file.type.startsWith("video/");
    const isFile = !isImage && !isVideo;

    // Choisir le bon preset Cloudinary
    const uploadPreset = isImage
      ? "images_preset"
      : isVideo
        ? "videos_preset"
        : "files_preset";

    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", uploadPreset);
    data.append("cloud_name", "dpjmh4yc9");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dpjmh4yc9/upload",
        { method: "POST", body: data },
      );

      const result = await res.json();

      // 🔥 type envoyé avec le message
      const type = isImage ? "image" : isVideo ? "video" : "file";

      // 🔥 envoie l’URL au parent
      onSend(result.secure_url, type);

      setLoading(false);
    } catch (err) {
      console.error("Upload error:", err);
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleUpload}
        accept="image/*,video/*,.pdf,.doc,.docx,.zip,.rar"
        className="hidden"
        id="fileInput"
      />

      <label
        htmlFor="fileInput"
        className="cursor-pointer px-3 py-2 bg-[#127f8a] text-white rounded hover:bg-[#0b525b]"
      >
        {loading ? "Envoi..." : "📎 Joindre un fichier"}
      </label>
    </div>
  );
}
