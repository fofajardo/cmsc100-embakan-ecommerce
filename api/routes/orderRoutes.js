import express from "express";
import orderController from "../controllers/orderController.js";

const router = express.Router();

router.get("/", orderController.getAllOrders);

router.get("/:id", orderController.getOneOrder);

router.post("/", orderController.createNewOrder);

router.post("/bulk", orderController.createBulkOrder);

router.put("/:id", orderController.updateOneOrder);

router.delete("/:id", orderController.deleteOneOrder);

export default router;
