const { body, param, validationResult } = require("express-validator");

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ 
      message: "Error de validación", 
      errors: errors.array() 
    });
  }
  next();
};

const productValidation = {
  create: [
    body("name").trim().notEmpty().withMessage("El nombre es requerido"),
    body("sku").trim().notEmpty().withMessage("El SKU es requerido"),
    body("salePrice").isNumeric().withMessage("El precio de venta debe ser numérico"),
    body("costPrice").isNumeric().withMessage("El precio de costo debe ser numérico"),
    body("category").trim().notEmpty().withMessage("La categoría es requerida"),
    body("supplier").trim().notEmpty().withMessage("El proveedor es requerido"),
    body("quantity").optional().isInt({ min: 0 }).withMessage("La cantidad debe ser un entero positivo"),
    body("minStock").optional().isInt({ min: 0 }).withMessage("El stock mínimo debe ser un entero positivo"),
    validate,
  ],
  sale: [
    body("sku").trim().notEmpty().withMessage("El SKU es requerido"),
    body("quantity").isInt({ min: 1 }).withMessage("La cantidad debe ser mayor a 0"),
    validate,
  ],
  addStock: [
    body("sku").trim().notEmpty().withMessage("El SKU es requerido"),
    body("quantity").isInt({ min: 1 }).withMessage("La cantidad debe ser mayor a 0"),
    validate,
  ],
};

module.exports = productValidation;
