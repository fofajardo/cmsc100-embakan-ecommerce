import express from "express";
import productController from "../controllers/productController.js";

const router = express.Router();

// Product

router.get("/", productController.getAllProducts);

router.get("/:id", productController.getOneProduct);

router.post("/", productController.createNewProduct);

router.put("/:id", productController.updateOneProduct);

router.delete("/:id", productController.deleteOneProduct);

router.post("/:id/variants/", productController.createNewProductVariant);

router.put("/:id/variants/:variantId", productController.updateOneProductVariant);

router.get("/:id/variants/:variantId", productController.getOneProductVariant);

router.delete("/:id/variants/:variantId", productController.deleteOneProductVariant);

export default router;