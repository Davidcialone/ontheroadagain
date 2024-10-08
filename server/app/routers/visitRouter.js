import { Router } from "express";
import * as visitController from "../controllers/visitController.js";
import { controllerWrapper as cw } from "./controllerWrapper.js";
import { jwtService } from "../middlewares/jwt.service.js";

export const router = Router();

router.use(jwtService);

// router.get("/me/trips/:id/visits", cw(visitController.getVisit));
router.post("/me/trips/:id/visit", cw(visitController.createVisit));
router.patch("/me/trips/:id/visit/:id", cw(visitController.updateVisit));
router.delete("/me/trips/:id/visit/:id", cw(visitController.deleteVisit));