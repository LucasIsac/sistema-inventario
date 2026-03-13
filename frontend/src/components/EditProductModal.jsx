import { useState, useEffect } from "react";
import { X, Loader2, Save } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/lib/currency";

export default function EditProductModal({ isOpen, onClose, product, onProductUpdated }) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "",
    supplier: "",
    costPrice: "",
    salePrice: "",
    quantity: "",
    minStock: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name || "",
        sku: product.sku || "",
        category: product.category || "",
        supplier: product.supplier || "",
        costPrice: product.costPrice?.toString() || "",
        salePrice: product.salePrice?.toString() || "",
        quantity: product.quantity?.toString() || "",
        minStock: product.minStock?.toString() || "",
      });
      setError(null);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const updatedData = {
        name: formData.name,
        category: formData.category,
        supplier: formData.supplier,
        costPrice: Number(formData.costPrice),
        salePrice: Number(formData.salePrice),
        quantity: Number(formData.quantity),
        minStock: Number(formData.minStock),
      };

      await axios.put(`/api/products/${product.sku}`, updatedData);
      
      if (onProductUpdated) {
        onProductUpdated();
      }
      onClose();
    } catch (err) {
      console.error("Error updating product:", err);
      setError(err.response?.data?.message || "Error al actualizar el producto");
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen || !product) return null;

  const profit = Number(formData.salePrice) - Number(formData.costPrice);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-2xl rounded-xl shadow-lg border border-border max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Editar Producto
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-auto">
          {error && (
            <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
              {error}
            </div>
          )}

          <div className="bg-secondary/30 p-4 rounded-lg">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs text-muted-foreground">SKU</span>
                <p className="text-sm font-medium text-foreground">{formData.sku}</p>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">Stock Actual</span>
                <p className="text-sm font-medium text-foreground">{formData.quantity} unidades</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Nombre del Producto *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Categoría
              </label>
              <input
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Proveedor
              </label>
              <input
                type="text"
                name="supplier"
                value={formData.supplier}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Stock Mínimo
              </label>
              <input
                type="number"
                name="minStock"
                value={formData.minStock}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Precio de Costo ($) *
              </label>
              <input
                type="number"
                name="costPrice"
                value={formData.costPrice}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Precio de Venta ($) *
              </label>
              <input
                type="number"
                name="salePrice"
                value={formData.salePrice}
                onChange={handleChange}
                step="0.01"
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                required
                min="0"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cantidad en Stock
              </label>
              <input
                type="number"
                name="quantity"
                value={formData.quantity}
                onChange={handleChange}
                className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                min="0"
              />
            </div>
          </div>

          <div className="bg-primary/10 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-foreground">
                Ganancia por unidad:
              </span>
              <span className={`text-lg font-bold ${profit >= 0 ? "text-emerald-500" : "text-destructive"}`}>
                {formatCurrency(profit)}
              </span>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground bg-secondary hover:bg-secondary/80 rounded-md transition-colors"
              disabled={saving}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-md transition-colors disabled:opacity-50 flex items-center gap-2"
              disabled={saving}
            >
              {saving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Guardando...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Guardar Cambios
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
