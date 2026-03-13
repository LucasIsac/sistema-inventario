const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Por favor ingresa el nombre del producto"],
      trim: true,
      maxLength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    sku: {
      type: String,
      required: [true, "Por favor ingresa el SKU"],
      unique: true,
      trim: true,
      uppercase: true,
    },
    quantity: {
      type: Number,
      default: 0,
      min: [0, "La cantidad no puede ser menor a 0"],
    },
    minStock: {
      type: Number,
      default: 10,
      min: [0, "El stock mínimo no puede ser menor a 0"],
    },
    salePrice: {
      type: Number,
      required: [true, "Por favor ingresa el precio de venta"],
      min: [0, "El precio debe ser positivo"],
    },
    costPrice: {
      type: Number,
      required: [true, "Por favor ingresa el precio de costo"],
      min: [0, "El precio debe ser positivo"],
    },
    category: {
      type: String,
      required: [true, "Por favor ingresa la categoría"],
      trim: true,
    },
    supplier: {
      type: String,
      required: [true, "Por favor ingresa el proveedor"],
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({ name: "text", sku: "text", category: "text" });

productSchema.virtual("profit").get(function () {
  return this.salePrice - this.costPrice;
});

productSchema.set("toJSON", { virtuals: true });
productSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Product", productSchema);
