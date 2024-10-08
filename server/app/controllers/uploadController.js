// import { VisitPhoto } from '../models/index.js';
import fs from 'fs/promises';
import path from 'path';

const uploadController = {
    async uploadPicture(req, res) {
      const { title, photo } = req.body;
      const base64Image = photo.split(';base64,').pop();
      let imagePath = path.join('public/photos', `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`); // Nom du fichier basé sur le nom du produit
    
      try {
        await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
        const sqlPath = `/photos/${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        console.log('Image sauvegardée avec succès à', sqlPath);
        res.status(200).json({ success: true, sqlPath });
      } catch (err) {
        console.error('Erreur lors de l\'écriture du fichier :', err);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
      }
    },

    async uploadPictureVisit(req, res) {
      const { title, photo } = req.body;
      const base64Image = photo.split(';base64,').pop();
      let imagePath = path.join('public/photosV', `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`); // Nom du fichier basé sur le nom du produit
    
      try {
        await fs.writeFile(imagePath, base64Image, { encoding: 'base64' });
        const sqlPath = `/photos/${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
        console.log('Image sauvegardée avec succès à', sqlPath);
        res.status(200).json({ success: true, sqlPath });
      } catch (err) {
        console.error('Erreur lors de l\'écriture du fichier :', err);
        return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'image.' });
      }
    }
};

export default uploadController;