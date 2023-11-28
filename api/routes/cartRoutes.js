import express from "express";
import cartController from "../controllers/cartController.js";

const router = express.Router();

// Cart

router.get("/:id", cartController.getOneCart);

router.post("/:id", cartController.createNewCart);

router.put("/:id", cartController.updateOneCart);

router.delete("/:id", cartController.deleteOneCart);

// Cart items

router.post("/:id/items", cartController.addOrCreateCartItem);

router.delete("/:id/items", cartController.deleteOneCartItem);

export default router;
