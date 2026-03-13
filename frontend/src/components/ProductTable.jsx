import { Badge } from "@/components/ui/badge";
import { Plus } from "lucide-react";
import { formatCurrency } from "@/lib/currency";

const ProgressBar = ({ value, max, isLow }) => {
  const safeValue = Number(value) || 0;
  const safeMax = Number(max) || 1;
  const percentage = Math.min((safeValue / safeMax) * 100, 100);

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground">{safeValue}</span>
      </div>
      <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isLow ? "bg-destructive" : "bg-accent"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default function ProductTable({
  products,
  loading,
  error,
  onSale,
  onAddStock,
  onEdit,
}) {
  if (loading) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        Cargando productos...
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-destructive">{error}</div>;
  }

  const handleSellClick = (e, product) => {
    e.stopPropagation();
    onSale(product.sku);
  };

  const handleAddStockClick = (e, product) => {
    e.stopPropagation();
    onAddStock(product.sku);
  };

  const handleRowClick = (product) => {
    if (onEdit) {
      onEdit(product);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary/30 border-b border-border">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Producto
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Categoría
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Proveedor
            </th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">
              Precio de Venta
            </th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
              Stock Actual
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
              Estado
            </th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">
              Acción
            </th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            const stock = product.quantity || 0;
            const maxStock = (product.minStock || 10) * 3;
            const isLowStock = stock < (product.minStock || 10);

            return (
              <tr
                key={product._id || product.id || idx}
                onClick={() => handleRowClick(product)}
                className={`border-b border-border hover:bg-secondary/20 transition-colors cursor-pointer ${
                  idx % 2 === 0 ? "bg-card/50" : ""
                }`}
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">
                  {product.name}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.category}
                </td>
                <td className="px-6 py-4 text-sm text-muted-foreground">
                  {product.supplier || "N/A"}
                </td>
                <td className="px-6 py-4 text-sm font-semibold text-right text-accent">
                  {formatCurrency(product.salePrice)}
                </td>
                <td className="px-6 py-4">
                  <ProgressBar
                    value={stock}
                    max={maxStock}
                    isLow={isLowStock}
                  />
                </td>
                <td className="px-6 py-4 text-center">
                  {isLowStock ? (
                    <Badge className="bg-destructive hover:bg-destructive text-white">
                      Stock Bajo
                    </Badge>
                  ) : (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">
                      Normal
                    </Badge>
                  )}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      onClick={(e) => handleAddStockClick(e, product)}
                      className="p-1 bg-secondary text-foreground rounded hover:bg-secondary/80 transition-colors"
                      title="Cargar Stock"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={(e) => handleSellClick(e, product)}
                      className="px-3 py-1 bg-primary text-primary-foreground text-xs rounded hover:bg-primary/90 transition-colors"
                    >
                      Vender
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
          {products.length === 0 && (
            <tr>
              <td
                colSpan="7"
                className="px-6 py-8 text-center text-muted-foreground"
              >
                No hay productos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
