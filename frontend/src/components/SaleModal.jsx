import { useState } from "react";
import { X, AlertCircle, Search } from "lucide-react";

export default function SaleModal({ isOpen, onClose, onConfirm, product, products }) {
  const [quantity, setQuantity] = useState(1);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(product || null);

  if (!isOpen) return null;

  const productList = products || [];
  const filteredProducts = productList.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentProduct = selectedProduct || product;

  const handleSelectProduct = (p) => {
    setSelectedProduct(p);
    setQuantity(1);
    setError(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentProduct) {
      setError("Por favor selecciona un producto");
      return;
    }
    if (quantity <= 0) {
      setError("La cantidad debe ser mayor a 0");
      return;
    }
    if (quantity > currentProduct.quantity) {
      setError(`Stock insuficiente (Máx: ${currentProduct.quantity})`);
      return;
    }
    onConfirm(currentProduct.sku, quantity);
    onClose();
    setSelectedProduct(null);
    setSearchTerm("");
  };

  const handleClose = () => {
    onClose();
    setSelectedProduct(null);
    setSearchTerm("");
    setQuantity(1);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-md rounded-xl shadow-lg border border-border animate-in fade-in zoom-in duration-200 max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground">
            Registrar Venta
          </h2>
          <button
            onClick={handleClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-auto">
          {!currentProduct ? (
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Seleccionar Producto
              </label>
              <div className="relative mb-3">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>
              <div className="border border-border rounded-lg max-h-48 overflow-auto">
                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground text-sm">
                    No se encontraron productos
                  </div>
                ) : (
                  filteredProducts.map((p) => (
                    <button
                      key={p._id}
                      type="button"
                      onClick={() => handleSelectProduct(p)}
                      className="w-full p-3 text-left hover:bg-secondary/50 border-b border-border last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-foreground">{p.name}</div>
                      <div className="text-sm text-muted-foreground flex justify-between">
                        <span>SKU: {p.sku}</span>
                        <span className={p.quantity <= p.minStock ? "text-destructive" : "text-emerald-500"}>
                          Stock: {p.quantity}
                        </span>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-sm font-medium text-muted-foreground">
                  Producto
                </label>
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  className="text-xs text-primary hover:underline"
                >
                  Cambiar
                </button>
              </div>
              <div className="bg-secondary/30 p-3 rounded-lg">
                <div className="text-lg font-medium text-foreground">
                  {currentProduct.name}
                </div>
                <div className="text-sm text-muted-foreground">
                  SKU: {currentProduct.sku}
                </div>
                <div className="text-sm text-accent mt-1">
                  Stock disponible: {currentProduct.quantity}
                </div>
              </div>
            </div>
          )}

          {currentProduct && (
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Cantidad a Vender
              </label>
              <input
                type="number"
                min="1"
                max={currentProduct.quantity}
                value={quantity}
                onChange={(e) => {
                  setQuantity(Number(e.target.value));
                  setError(null);
                }}
                className="w-full px-4 py-2 bg-background border border-input rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground transition-all"
                autoFocus
              />
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 text-destructive text-sm bg-destructive/10 p-3 rounded-lg">
              <AlertCircle className="w-4 h-4" />
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-sm font-medium text-foreground hover:bg-secondary rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!currentProduct || error || quantity <= 0}
              className="px-4 py-2 text-sm font-medium text-primary-foreground bg-primary hover:bg-primary/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Confirmar Venta
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
