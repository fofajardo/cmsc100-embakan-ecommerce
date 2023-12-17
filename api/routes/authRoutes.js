import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-in", authController.signIn);

router.post("/sign-out", authController.signOut);

router.get("/signed-in-user", authController.signedInUser);

router.get("/dump-session", authController.dumpSession);

export default router;
