import { User, Trip, Visit } from '../models/index.js';
import bcrypt from 'bcrypt';

const userController = {
  async getUser(req,res, next){
    const thingObject = JSON.parse(req.body.thing);

    const userId = parseInt(req.params.id);
    const user = await User.findByPk(userId);
    if (!user){
      return res.status(404).json({error: "Utilisateur non trouvé"})
    }
    res.json(user)
  },
    async updateUser(req, res){
      const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId);
        const updatedData = req.body;
        if (updatedData.password) {
          updatedData.password = await bcrypt.hash(updatedData.password, 15);
        }
        await user.update(updatedData);
    
        res.status(200).json({ message: 'Profil mis à jour avec succès' });
    },

    async deleteUser(req,res, next){
      const userId = parseInt(req.params.id);
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ message: 'Utilisateur non trouvé' });
        }
        const trips = await Trip.findAll({ where: { user_id: userId } });
        for (const trip of trips) {
          await Visit.destroy({ where: { trip_id: trip.id } });
        }
        await Trip.destroy({ where: { user_id: userId } });
        await user.destroy();
          res.status(200).json({ message: 'Compte utilisateur supprimé avec succès' });
    }
    };

export default userController;