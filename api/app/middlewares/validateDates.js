import { Trip } from "../models/index.js";

// Middleware de validation des dates
export async function validateVisitDates(req, res, next) {
  const { tripId } = req.params;
  const { dateStart, dateEnd } = req.body;

  // Charger les informations du voyage
  const trip = await Trip.findByPk(tripId);
  if (!trip) {
    return res.status(404).json({ message: "Voyage non trouvé" });
  }

  // Convertir les dates en objets Date
  const visitStart = new Date(dateStart);
  const visitEnd = new Date(dateEnd);
  const tripStart = new Date(trip.dateStart);
  const tripEnd = new Date(trip.dateEnd);

  // Vérifier si les dates des visites sont incluses dans les dates du voyage
  if (visitStart < tripStart || visitEnd > tripEnd) {
    return res.status(400).json({
      message:
        "Les dates de la visite doivent être comprises dans les dates du voyage.",
    });
  }

  next(); // Passer au middleware suivant si les dates sont valides
}
