import cloudinaryPkg from "cloudinary";
const { v2: cloudinary } = cloudinaryPkg;

import dotenv from "dotenv";

dotenv.config(); // Charger les variables d'environnement

// Configurer Cloudinary avec tes variables d'environnement
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadController = {
  // Fonction utilitaire pour uploader une image sur Cloudinary
  async uploadImageToCloudinary(imageBase64, folder, title) {
    try {
      // Upload de l'image vers Cloudinary
      const result = await cloudinary.uploader.upload(
        `data:image/jpeg;base64,${imageBase64}`,
        {
          folder: folder, // Spécifie le dossier sur Cloudinary
          public_id: title.replace(/\s+/g, "_").toLowerCase(), // Nom basé sur le titre
          overwrite: true,
          resource_type: "image",
        }
      );

      return result.secure_url; // URL sécurisée de l'image sur Cloudinary
    } catch (error) {
      throw new Error("Erreur lors de l'upload vers Cloudinary");
    }
  },

  // Uploader une image pour un produit
  async uploadPicture(req, res) {
    const { title, photo } = req.body;

    if (!title || !photo) {
      return res
        .status(400)
        .json({ message: "Le titre et la photo sont requis." });
    }

    // Extraire la partie base64 de l'image
    const base64Image = photo.split(";base64,").pop();

    try {
      // Uploader l'image dans le dossier "photos"
      const imageUrl = await this.uploadImageToCloudinary(
        base64Image,
        "photos",
        title
      );
      console.log("Image sauvegardée avec succès sur Cloudinary à", imageUrl);

      // Répondre avec l'URL de l'image sauvegardée
      res.status(200).json({ success: true, imageUrl });
    } catch (err) {
      console.error("Erreur lors de l'upload de l'image :", err);
      res
        .status(500)
        .json({ message: "Erreur lors du téléchargement de l'image." });
    }
  },

  // Uploader une image pour une visite
  async uploadPictureVisit(req, res) {
    const { title, photo } = req.body;

    if (!title || !photo) {
      return res
        .status(400)
        .json({ message: "Le titre et la photo sont requis." });
    }

    // Extraire la partie base64 de l'image
    const base64Image = photo.split(";base64,").pop();

    try {
      // Uploader l'image dans le dossier "photosV"
      const imageUrl = await this.uploadImageToCloudinary(
        base64Image,
        "photosV",
        title
      );
      console.log(
        "Image de visite sauvegardée avec succès sur Cloudinary à",
        imageUrl
      );

      // Répondre avec l'URL de l'image sauvegardée
      res.status(200).json({ success: true, imageUrl });
    } catch (err) {
      console.error("Erreur lors de l'upload de l'image :", err);
      res.status(500).json({
        message: "Erreur lors du téléchargement de l'image de visite.",
      });
    }
  },
};

export default uploadController;
