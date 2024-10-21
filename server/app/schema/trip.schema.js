import Joi from "joi";

export const tripIdSchema = Joi.object({
  id: Joi.number().integer().required(),
});

export const createTripSchema = Joi.object({
  dateStart: Joi.date().required(),
  dateEnd: Joi.date().required(),
  photo: Joi.string(),
  title: Joi.string().max(255).required(),
  description: Joi.string().max(2048),
  rating: Joi.number().min(0).max(5),
  user_id: Joi.number().integer().required(),
});

export const updateTripSchema = Joi.object({
  dateStart: Joi.date(),
  dateEnd: Joi.date(),
  photo: Joi.string(),
  title: Joi.string().max(255),
  description: Joi.string().max(2048),
  rating: Joi.number().min(0).max(5),
});
