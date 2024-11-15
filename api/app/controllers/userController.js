import { User } from "../models/index.js";

export const userController = {
  async getUser(req, res) {
    try {
      const userId = parseInt(req.params.id);
      console.log("ID utilisateur reçu :", userId);

      const user = await User.findByPk(userId);
      if (!user) {
        console.log("Utilisateur non trouvé dans la base de données :", userId);
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      res.status(200).json(user);
    } catch (error) {
      console.error("Erreur dans le contrôleur getUser :", error);
      res.status(500).json({ error: "Erreur serveur" });
    }
  },

  async updateUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const updatedData = req.body;

      if (updatedData.password) {
        updatedData.password = await bcrypt.hash(updatedData.password, 15);
      }

      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      await user.update(updatedData);
      res.status(200).json({ message: "Profile updated successfully" });
    } catch (error) {
      next(error);
    }
  },

  async deleteUser(req, res, next) {
    try {
      const userId = parseInt(req.params.id);
      const user = await User.findByPk(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // If cascade deletion is not set:
      const trips = await Trip.findAll({ where: { user_id: userId } });
      for (const trip of trips) {
        await Visit.destroy({ where: { trip_id: trip.id } });
      }
      await Trip.destroy({ where: { user_id: userId } });
      await user.destroy();

      res.status(200).json({ message: "User account deleted successfully" });
    } catch (error) {
      next(error);
    }
  },
};
export default userController;
