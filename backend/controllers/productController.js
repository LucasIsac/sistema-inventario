const Product = require("../models/Product");
const Sale = require("../models/Sale");
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

    const totalPrice = product.salePrice * quantity;

    const sale = await Sale.create({
      product: product._id,
      productName: product.name,
      sku: product.sku,
      quantity: Number(quantity),
      unitPrice: product.salePrice,
      totalPrice: totalPrice,
      saleDate: new Date(),
    });

    product.quantity -= Number(quantity);
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
        saleId: sale._id,
        productName: product.name,
        sku: product.sku,
        quantitySold: Number(quantity),
        unitPrice: product.salePrice,
        totalPrice: totalPrice,
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

const getSalesReport = async (req, res, next) => {
  try {
    const { period } = req.query;
    const now = new Date();
    let startDate;

    switch (period) {
      case "day":
        startDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case "week":
        startDate = new Date(now);
        startDate.setDate(startDate.getDate() - 7);
        break;
      case "month":
        startDate = new Date(now);
        startDate.setMonth(startDate.getMonth() - 1);
        break;
      default:
        startDate = new Date(now.setHours(0, 0, 0, 0));
    }

    const sales = await Sale.find({ saleDate: { $gte: startDate } })
      .sort({ saleDate: -1 })
      .lean();

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);
    const uniqueProducts = [...new Set(sales.map(s => s.sku))].length;

    const salesByProduct = sales.reduce((acc, sale) => {
      if (!acc[sale.sku]) {
        acc[sale.sku] = {
          productName: sale.productName,
          sku: sale.sku,
          quantity: 0,
          revenue: 0,
        };
      }
      acc[sale.sku].quantity += sale.quantity;
      acc[sale.sku].revenue += sale.totalPrice;
      return acc;
    }, {});

    const productSummary = Object.values(salesByProduct).sort((a, b) => b.quantity - a.quantity);

    res.status(200).json({
      success: true,
      period,
      summary: {
        totalRevenue,
        totalQuantity,
        totalSales: sales.length,
        uniqueProducts,
      },
      sales,
      productSummary,
    });
  } catch (error) {
    next(error);
  }
};

const getTodaySales = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const sales = await Sale.find({ saleDate: { $gte: today } })
      .sort({ saleDate: -1 })
      .lean();

    const totalRevenue = sales.reduce((acc, sale) => acc + sale.totalPrice, 0);
    const totalQuantity = sales.reduce((acc, sale) => acc + sale.quantity, 0);

    res.status(200).json({
      success: true,
      sales,
      summary: {
        totalRevenue,
        totalQuantity,
        totalSales: sales.length,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateProduct = async (req, res, next) => {
  const { sku } = req.params;

  try {
    const product = await Product.findOne({ sku });

    if (!product) {
      return res.status(404).json({ message: "Producto no encontrado" });
    }

    const allowedUpdates = ["name", "category", "supplier", "costPrice", "salePrice", "quantity", "minStock"];
    const updates = {};

    for (const key of allowedUpdates) {
      if (req.body[key] !== undefined) {
        updates[key] = req.body[key];
      }
    }

    const updatedProduct = await Product.findOneAndUpdate(
      { sku },
      updates,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
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
  getSalesReport,
  getTodaySales,
  updateProduct,
};
