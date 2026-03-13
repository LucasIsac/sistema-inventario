import { useState } from "react";
import { X, AlertCircle } from "lucide-react";

export default function AddStockModal({ isOpen, onClose, onConfirm, product }) {
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (quantity <= 0) return;
    onConfirm(product.sku, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border animate-in fade-in zoom-in duration-200">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Cargar Stock
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="bg-secondary/30 p-4 rounded-lg">
            <label className="block text-sm font-medium text-muted-foreground mb-1">
              Producto
            </label>
            <div className="text-lg font-medium text-foreground">
              {product.name}
            </div>
            <div className="flex items-center justify-between mt-2 text-sm">
              <span className="text-muted-foreground">Stock actual:</span>
              <span className="font-semibold text-foreground">
                {product.quantity}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1 text-sm">
              <span className="text-muted-foreground">Stock final:</span>
              <span className="font-semibold text-emerald-600">
                {product.quantity + Number(quantity)}
              </span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Cantidad a Agregar
            </label>
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={quantity <= 0}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Carga
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
