const express = require("express");
const router = express.Router();
const productValidation = require("../middleware/validation");
const {
  getProducts,
  createProduct,
  registerSale,
  addStock,
} = require("../controllers/productController");

router.get("/", getProducts);
router.post("/", productValidation.create, createProduct);
router.post("/venta", productValidation.sale, registerSale);
router.post("/add-stock", productValidation.addStock, addStock);

module.exports = router;
