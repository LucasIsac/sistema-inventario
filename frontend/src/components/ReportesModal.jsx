import { useState, useEffect } from "react";
import { X, TrendingUp, Calendar, DollarSign, Package, Loader2 } from "lucide-react";
import axios from "axios";
import { formatCurrency } from "@/lib/currency";

export default function ReportesModal({ isOpen, onClose }) {
  const [period, setPeriod] = useState("day");
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchReport();
    }
  }, [period, isOpen]);

  const fetchReport = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`/api/products/reportes?period=${period}`);
      setReport(response.data);
    } catch (err) {
      console.error("Error fetching report:", err);
      setError("Error al cargar el reporte");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const periodLabels = {
    day: "Hoy",
    week: "Esta Semana",
    month: "Este Mes",
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("es-AR", {
      day: "2-digit",
      month: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-4xl rounded-xl shadow-lg border border-border max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-accent" />
            Reportes de Ventas
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 border-b border-border">
          <div className="flex gap-2">
            {["day", "week", "month"].map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  period === p
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground hover:bg-secondary/80"
                }`}
              >
                {periodLabels[p]}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 overflow-auto flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : error ? (
            <div className="text-destructive text-center py-8">{error}</div>
          ) : report ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <DollarSign className="w-4 h-4" />
                    Ingresos Totales
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {formatCurrency(report.summary.totalRevenue)}
                  </div>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Package className="w-4 h-4" />
                    Unidades Vendidas
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {report.summary.totalQuantity}
                  </div>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <TrendingUp className="w-4 h-4" />
                    Total Ventas
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {report.summary.totalSales}
                  </div>
                </div>
                <div className="bg-secondary/30 p-4 rounded-lg">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                    <Calendar className="w-4 h-4" />
                    Productos Únicos
                  </div>
                  <div className="text-2xl font-bold text-foreground">
                    {report.summary.uniqueProducts}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Productos Vendidos
                </h3>
                {report.productSummary.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No hay ventas en este período
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary/30">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                            Producto
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                            SKU
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                            Cantidad
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                            Ingresos
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.productSummary.map((product, idx) => (
                          <tr
                            key={product.sku}
                            className={`border-t border-border ${
                              idx % 2 === 0 ? "bg-card/50" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-sm text-foreground">
                              {product.productName}
                            </td>
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {product.sku}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-foreground">
                              {product.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-emerald-500 font-medium">
                              {formatCurrency(product.revenue)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Detalle de Ventas
                </h3>
                {report.sales.length === 0 ? (
                  <div className="text-muted-foreground text-center py-8">
                    No hay ventas en este período
                  </div>
                ) : (
                  <div className="border border-border rounded-lg overflow-hidden">
                    <table className="w-full">
                      <thead className="bg-secondary/30">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                            Fecha
                          </th>
                          <th className="px-4 py-3 text-left text-sm font-semibold text-foreground">
                            Producto
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                            Cantidad
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                            Precio Unit.
                          </th>
                          <th className="px-4 py-3 text-right text-sm font-semibold text-foreground">
                            Total
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {report.sales.slice(0, 10).map((sale, idx) => (
                          <tr
                            key={sale._id}
                            className={`border-t border-border ${
                              idx % 2 === 0 ? "bg-card/50" : ""
                            }`}
                          >
                            <td className="px-4 py-3 text-sm text-muted-foreground">
                              {formatDate(sale.saleDate)}
                            </td>
                            <td className="px-4 py-3 text-sm text-foreground">
                              {sale.productName}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-foreground">
                              {sale.quantity}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-muted-foreground">
                              {formatCurrency(sale.unitPrice)}
                            </td>
                            <td className="px-4 py-3 text-sm text-right text-emerald-500 font-medium">
                              {formatCurrency(sale.totalPrice)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
