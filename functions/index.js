import { onRequest } from "firebase-functions/v2/https";
import axios from "axios";
import crypto from "crypto";

export const uploadProfile = onRequest(async (req, res) => {
  // Autoriser seulement POST
  if (req.method !== "POST") {
    return res.status(405).send("Méthode non autorisée");
  }

  try {
    const { image } = req.body;

    if (!image) {
      return res.status(400).json({ error: "Aucune image reçue" });
    }

    // CLOUDINARY CONFIG
    const CLOUD_NAME = "gattdaniel";
    const UPLOAD_PRESET = "photoprofil"; // ton preset non signé
    const API_KEY = "626481877448817"; // ta clé API
    const API_SECRET = "**************************"; // ton API secret

    // URL Cloudinary
    const url = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;

    const timestamp = Math.floor(Date.now() / 1000);

    // Génération signature Cloudinary
    const signature = crypto
      .createHash("sha1")
      .update(`timestamp=${timestamp}&upload_preset=${UPLOAD_PRESET}${API_SECRET}`)
      .digest("hex");

    // Envoi à Cloudinary
    const response = await axios.post(url, {
      file: image,
      timestamp,
      upload_preset: UPLOAD_PRESET,
      api_key: API_KEY,
      signature,
    });

    res.json({ url: response.data.secure_url });
  } catch (error) {
    console.error("Erreur Cloudinary:", error.response?.data || error);
    res.status(500).json({ error: "Échec upload Cloudinary" });
  }
});
