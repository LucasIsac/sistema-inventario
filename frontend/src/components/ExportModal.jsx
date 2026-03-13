import { useState } from "react";
import { X, Download, FileText, Package, Receipt, Loader2, Calendar } from "lucide-react";
import axios from "axios";

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const formatDateTime = (date) => {
  return new Date(date).toLocaleString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function ExportModal({ isOpen, onClose }) {
  const [loading, setLoading] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  if (!isOpen) return null;

  const exportToCSV = (data, filename, headers, title) => {
    const separator = ";";
    
    const headerLine = [title, "", "", "", "", "", ""].join(separator);
    const headersLine = headers.map(h => h.label).join(separator);
    
    const dataLines = data.map(row => 
      headers.map(h => {
        let value = row[h.key];
        if (value === null || value === undefined) value = "";
        if (typeof value === "number") {
          value = value.toString().replace(".", ",");
        }
        if (typeof value === "string" && value.includes(separator)) {
          value = `"${value}"`;
        }
        return value;
      }).join(separator)
    ).join("\n");

    const csvContent = `${headerLine}\n${headersLine}\n${dataLines}`;
    const BOM = "\uFEFF";
    const blob = new Blob([BOM + csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${filename}_${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  const handleExport = async (type) => {
    setLoading(type);
    try {
      const period = selectedPeriod;

      if (type === "productos") {
        const response = await axios.get("/api/products");
        const products = response.data;
        
        const data = products.map(p => ({
          nombre: p.name,
          sku: p.sku,
          categoria: p.category,
          proveedor: p.supplier,
          precio_costo: p.costPrice,
          precio_venta: p.salePrice,
          cantidad: p.quantity,
          stock_minimo: p.minStock,
          ganancia: p.salePrice - p.costPrice,
          valor_total: p.quantity * p.salePrice,
          estado: p.quantity <= p.minStock ? "STOCK BAJO" : "NORMAL",
          fecha_creacion: formatDate(p.createdAt)
        }));

        const totalInventario = data.reduce((acc, p) => acc + p.valor_total, 0);
        const stockBajo = data.filter(p => p.estado === "STOCK BAJO").length;

        exportToCSV(data, "inventario_productos", [
          { key: "nombre", label: "Nombre" },
          { key: "sku", label: "SKU" },
          { key: "categoria", label: "Categoría" },
          { key: "proveedor", label: "Proveedor" },
          { key: "precio_costo", label: "Precio Costo" },
          { key: "precio_venta", label: "Precio Venta" },
          { key: "cantidad", label: "Cantidad" },
          { key: "stock_minimo", label: "Stock Mín" },
          { key: "ganancia", label: "Ganancia" },
          { key: "valor_total", label: "Valor Total" },
          { key: "estado", label: "Estado" },
          { key: "fecha_creacion", label: "Fecha" }
        ], `INVENTARIO - Total: ${formatCurrency(totalInventario)} | Productos: ${products.length} | Stock Bajo: ${stockBajo}`);
      
      } else if (type === "ventas") {
        const response = await axios.get(`/api/products/reportes?period=${period}`);
        const sales = response.data.sales || [];
        const summary = response.data.summary || {};
        
        const data = sales.map(s => ({
          fecha: formatDateTime(s.saleDate),
          producto: s.productName,
          sku: s.sku,
          cantidad: s.quantity,
          precio_unitario: s.unitPrice,
          total: s.totalPrice
        }));

        data.push({
          fecha: "",
          producto: "TOTALES",
          sku: "",
          cantidad: summary.totalQuantity || 0,
          precio_unitario: "",
          total: summary.totalRevenue || 0
        });

        const periodLabel = period === "day" ? "HOY" : period === "week" ? "ÚLTIMA SEMANA" : "ÚLTIMO MES";
        exportToCSV(data, "ventas", [
          { key: "fecha", label: "Fecha/Hora" },
          { key: "producto", label: "Producto" },
          { key: "sku", label: "SKU" },
          { key: "cantidad", label: "Cantidad" },
          { key: "precio_unitario", label: "P. Unitario" },
          { key: "total", label: "Total" }
        ], `VENTAS ${periodLabel} - Ventas: ${sales.length} | Ingresos: ${formatCurrency(summary.totalRevenue || 0)}`);
      
      } else if (type === "resumen") {
        const [daySales, weekSales, monthSales] = await Promise.all([
          axios.get("/api/products/reportes?period=day"),
          axios.get("/api/products/reportes?period=week"),
          axios.get("/api/products/reportes?period=month")
        ]);

        const data = [
          {
            periodo: "HOY",
            ventas: daySales.data.summary.totalSales || 0,
            unidades: daySales.data.summary.totalQuantity || 0,
            ingresos: daySales.data.summary.totalRevenue || 0,
            productos: daySales.data.summary.uniqueProducts || 0
          },
          {
            periodo: "ESTA SEMANA",
            ventas: weekSales.data.summary.totalSales || 0,
            unidades: weekSales.data.summary.totalQuantity || 0,
            ingresos: weekSales.data.summary.totalRevenue || 0,
            productos: weekSales.data.summary.uniqueProducts || 0
          },
          {
            periodo: "ESTE MES",
            ventas: monthSales.data.summary.totalSales || 0,
            unidades: monthSales.data.summary.totalQuantity || 0,
            ingresos: monthSales.data.summary.totalRevenue || 0,
            productos: monthSales.data.summary.uniqueProducts || 0
          }
        ];

        exportToCSV(data, "resumen_ventas", [
          { key: "periodo", label: "Período" },
          { key: "ventas", label: "N° Ventas" },
          { key: "unidades", label: "Unidades" },
          { key: "ingresos", label: "Ingresos" },
          { key: "productos", label: "Productos" }
        ], "RESUMEN DE VENTAS");
      
      } else if (type === "kardex") {
        const [productsRes, allSales] = await Promise.all([
          axios.get("/api/products"),
          axios.get("/api/products/reportes?period=month")
        ]);

        const products = productsRes.data;
        const sales = allSales.data.sales || [];
        
        const data = products.map(p => {
          const productSales = sales.filter(s => s.sku === p.sku);
          const entrada = 0;
          const salida = productSales.reduce((acc, s) => acc + s.quantity, 0);
          const saldo = p.quantity;
          const costo = p.costPrice * saldo;
          const venta = p.salePrice * saldo;
          
          return {
            codigo: p.sku,
            producto: p.name,
            entrada: entrada,
            salida: salida,
            saldo: saldo,
            costo_unitario: p.costPrice,
            venta_unitario: p.salePrice,
            costo_total: costo,
            venta_total: venta,
            rentabilidad: venta - costo
          };
        });

        const totalCosto = data.reduce((acc, d) => acc + d.costo_total, 0);
        const totalVenta = data.reduce((acc, d) => acc + d.venta_total, 0);

        exportToCSV(data, "kardex", [
          { key: "codigo", label: "Código" },
          { key: "producto", label: "Producto" },
          { key: "entrada", label: "Entrada" },
          { key: "salida", label: "Salida" },
          { key: "saldo", label: "Saldo" },
          { key: "costo_unitario", label: "Costo Unit." },
          { key: "venta_unitario", label: "Venta Unit." },
          { key: "costo_total", label: "Costo Total" },
          { key: "venta_total", label: "Venta Total" },
          { key: "rentabilidad", label: "Ganancia" }
        ], `KARDEX - Costo: ${formatCurrency(totalCosto)} | Venta: ${formatCurrency(totalVenta)} | Ganancia: ${formatCurrency(totalVenta - totalCosto)}`);
      }

      onClose();
    } catch (err) {
      console.error("Error exporting:", err);
      alert("Error al exportar los datos");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Download className="w-5 h-5 text-accent" />
            Exportar Datos
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="px-3 py-2 bg-background border border-input rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="day">Hoy</option>
              <option value="week">Esta Semana</option>
              <option value="month">Este Mes</option>
            </select>
          </div>

          <p className="text-sm text-muted-foreground">
            Selecciona el tipo de datos que deseas exportar:
          </p>

          <button
            onClick={() => handleExport("productos")}
            disabled={loading}
            className="w-full p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-4 disabled:opacity-50"
          >
            {loading === "productos" ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <Package className="w-8 h-8 text-primary" />
            )}
            <div className="text-left">
              <div className="font-medium text-foreground">Inventario Completo</div>
              <div className="text-sm text-muted-foreground">
                Todos los productos con precios, stock y valor total
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExport("ventas")}
            disabled={loading}
            className="w-full p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-4 disabled:opacity-50"
          >
            {loading === "ventas" ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <Receipt className="w-8 h-8 text-emerald-500" />
            )}
            <div className="text-left">
              <div className="font-medium text-foreground">Historial de Ventas</div>
              <div className="text-sm text-muted-foreground">
                Detalle de ventas del período seleccionado
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExport("resumen")}
            disabled={loading}
            className="w-full p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-4 disabled:opacity-50"
          >
            {loading === "resumen" ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <FileText className="w-8 h-8 text-amber-500" />
            )}
            <div className="text-left">
              <div className="font-medium text-foreground">Resumen de Ventas</div>
              <div className="text-sm text-muted-foreground">
                Comparativa: Hoy, Semana y Mes
              </div>
            </div>
          </button>

          <button
            onClick={() => handleExport("kardex")}
            disabled={loading}
            className="w-full p-4 border border-border rounded-lg hover:bg-secondary/50 transition-colors flex items-center gap-4 disabled:opacity-50"
          >
            {loading === "kardex" ? (
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            ) : (
              <FileText className="w-8 h-8 text-blue-500" />
            )}
            <div className="text-left">
              <div className="font-medium text-foreground">Kardex (Movimientos)</div>
              <div className="text-sm text-muted-foreground">
                Entradas, salidas, saldo y rentabilidad por producto
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
