const express = require("express");
const router = express.Router();
const productValidation = require("../middleware/validation");
const {
  getProducts,
  createProduct,
  registerSale,
  addStock,
  getSalesReport,
  getTodaySales,
  updateProduct,
} = require("../controllers/productController");

router.get("/reportes", getSalesReport);
router.get("/ventas-hoy", getTodaySales);
router.get("/", getProducts);
router.post("/", productValidation.create, createProduct);
router.put("/:sku", updateProduct);
router.post("/venta", productValidation.sale, registerSale);
router.post("/add-stock", productValidation.addStock, addStock);

module.exports = router;
