import { Router } from "express";
import authController from "../controllers/authController.js";
import userController from "../controllers/userController.js";
import { controllerWrapper as cw } from "./controllerWrapper.js";

export const router = Router();

router.post("/signup", cw(authController.handleSignupFormSubmit));
router.post("/login", cw(authController.handleLoginFormSubmit));

// router.get("/logout", authController.logout);

router.get("/profil/:id", cw, userController.getUser);
router.patch("/profil/:id", cw, userController.updateUser);
router.delete("/profil/:id", cw, userController.deleteUser);
