import express from "express";
import authController from "../controllers/authController.js";

const router = express.Router();

router.post("/sign-in", authController.signIn);

router.get("/signed-in-user", authController.signedInUser);

router.get("/sign-out", authController.signOut);

router.get("/refresh", authController.refresh);

router.get("/dump-session", authController.dumpSession);

export default router;
