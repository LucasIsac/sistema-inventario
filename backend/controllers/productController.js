const Product = require("../models/Product");
const { notifyLowStock } = require("../utils/n8nService");

const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().lean();
    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: `El SKU ${req.body.sku} ya existe` });
    }
    next(error);
  }
};

const registerSale = async (req, res, next) => {
  const { sku, quantity } = req.body;

  try {
    const product = await Product.findOne({ sku });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    if (product.quantity < quantity) {
      return res.status(400).json({ 
        message: "Stock insuficiente", 
        available: product.quantity 
      });
    }

    product.quantity -= quantity;
    await product.save();

    if (product.quantity < product.minStock) {
      notifyLowStock(product).catch((err) =>
        console.error("Error al enviar notificación de stock bajo:", err.message)
      );
    }

    res.status(200).json({
      success: true,
      message: "Venta registrada exitosamente",
      data: {
        productName: product.name,
        sku: product.sku,
        quantitySold: quantity,
        remainingStock: product.quantity,
      },
    });
  } catch (error) {
    next(error);
  }
};

const addStock = async (req, res, next) => {
  const { sku, quantity } = req.body;

  try {
    const product = await Product.findOne({ sku });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    product.quantity = (product.quantity || 0) + Number(quantity);
    await product.save();

    res.status(200).json({
      success: true,
      message: "Stock agregado exitosamente",
      data: {
        productName: product.name,
        sku: product.sku,
        addedQuantity: Number(quantity),
        newStock: product.quantity,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  createProduct,
  registerSale,
  addStock,
};
