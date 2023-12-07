import express from "express";
import userController from "../controllers/userController.js";

const router = express.Router();

// User

router.get("/", userController.getAllUsers);

router.get("/:id", userController.getOneUser);

router.post("/", userController.createNewUser);

router.put("/:id", userController.updateOneUser);

router.delete("/:id", userController.deleteOneUser);

router.get("/:id/order-history", userController.getUserOrderHistory);

export default router;