import { useState, useEffect, useMemo } from "react";
import { Package, AlertCircle, TrendingUp, Plus, Search } from "lucide-react";
import axios from "axios";
import StatsCards from "@/components/StatsCards";
import ProductTable from "@/components/ProductTable";
import SaleButton from "@/components/SaleButton";
import AddProductModal from "@/components/AddProductModal";
import SaleModal from "@/components/SaleModal";
import AddStockModal from "@/components/AddStockModal";
import InventoryStatsChart from "@/components/InventoryStatsChart";
import CategoryDistribution from "@/components/CategoryDistribution";
import ReportesModal from "@/components/ReportesModal";
import EditProductModal from "@/components/EditProductModal";
import ExportModal from "@/components/ExportModal";
import ConfigModal from "@/components/ConfigModal";

export default function Dashboard() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todaySales, setTodaySales] = useState({ totalRevenue: 0, totalQuantity: 0, totalSales: 0 });

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSaleModalOpen, setIsSaleModalOpen] = useState(false);
  const [isAddStockModalOpen, setIsAddStockModalOpen] = useState(false);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Search State
  const [searchTerm, setSearchTerm] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  // Fetch Products
  const fetchProducts = async () => {
    try {
      const response = await axios.get("/api/products");
      if (Array.isArray(response.data)) {
        setProducts(response.data);
      } else {
        console.error("API did not return an array:", response.data);
      }
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError("Error al cargar los productos");
      setLoading(false);
    }
  };

  // Fetch Today's Sales
  const fetchTodaySales = async () => {
    try {
      const response = await axios.get("/api/products/ventas-hoy");
      if (response.data?.summary) {
        setTodaySales(response.data.summary);
      }
    } catch (err) {
      console.error("Error fetching today's sales:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchTodaySales();
  }, []);

  // Calculate Stats
  const stats = useMemo(() => {
    if (!Array.isArray(products))
      return {
        totalValue: 0,
        lowStockCount: 0,
        totalProducts: 0,
        categoryData: [],
      };

    const totalValue = products.reduce(
      (acc, curr) => acc + curr.quantity * curr.costPrice,
      0,
    );
    const lowStockCount = products.filter(
      (p) => p.quantity <= p.minStock,
    ).length;
    const totalProducts = products.length;

    const categoryCounts = products.reduce((acc, curr) => {
      acc[curr.category] = (acc[curr.category] || 0) + 1;
      return acc;
    }, {});

    const categoryData = Object.entries(categoryCounts)
      .map(([name, value]) => ({
        name,
        value,
      }))
      .sort((a, b) => b.value - a.value);

    return {
      totalValue,
      lowStockCount,
      totalProducts,
      categoryData,
    };
  }, [products]);

  // Filtered Products
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Handle Create Product
  const handleCreateProduct = async (productData) => {
    try {
      await axios.post("/api/products", productData);
      // Refresh list
      await fetchProducts();
    } catch (err) {
      console.error(err);
      throw new Error(
        err.response?.data?.message || "Error al guardar el producto",
      );
    }
  };

  // Open Sale Modal (triggered from Table)
  const openSaleModal = (sku) => {
    const product = products.find((p) => p.sku === sku);
    if (product) {
      setSelectedProduct(product);
      setIsSaleModalOpen(true);
    }
  };

  // Open Add Stock Modal (triggered from Table)
  const openAddStockModal = (sku) => {
    const product = products.find((p) => p.sku === sku);
    if (product) {
      setSelectedProduct(product);
      setIsAddStockModalOpen(true);
    }
  };

  // Open Edit Modal (triggered from Table row click)
  const openEditModal = (product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  // Handle Main Sale Button (General Action)
  const handleMainSaleClick = () => {
    if (products.length === 0) {
      alert("No hay productos disponibles para vender");
      return;
    }
    setSelectedProduct(null);
    setIsSaleModalOpen(true);
  };

  // Confirm Sale (from Modal)
  const handleConfirmSale = async (sku, quantity) => {
    try {
      setActionLoading(true);
      await axios.post("/api/products/venta", {
        sku,
        quantity: Number(quantity),
      });
      await fetchProducts();
      await fetchTodaySales();
      console.log("Venta registrada");
    } catch (err) {
      console.error(err);
      alert(
        "Error en la venta: " +
          (err.response?.data?.message || "Error desconocido"),
      );
    } finally {
      setActionLoading(false);
    }
  };

  // Confirm Add Stock (from Modal)
  const handleConfirmAddStock = async (sku, quantity) => {
    try {
      setActionLoading(true);
      await axios.post("/api/products/add-stock", {
        sku,
        quantity: Number(quantity),
      });
      // Refresh list
      await fetchProducts();
      console.log("Stock agregado");
    } catch (err) {
      console.error(err);
      alert(
        "Error al cargar stock: " +
          (err.response?.data?.message || "Error desconocido"),
      );
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-lg">
                <Package className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  Inventory Dashboard
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  Gestión de inventario en tiempo real
                </p>
              </div>
            </div>
            {/* Add Product Button */}
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm"
            >
              <Plus className="w-5 h-5" />
              Nuevo Producto
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Section */}
        <StatsCards stats={stats} todaySales={todaySales} />

        {/* Charts Section */}
        {!loading && (
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <InventoryStatsChart products={products} />
            <CategoryDistribution data={stats.categoryData} />
          </div>
        )}

        {/* Sales and Table Section */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Product Table */}
          <div className="lg:col-span-3">
            <div className="flex flex-col gap-4">
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Buscar por nombre o SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
              </div>

              <div className="border border-border rounded-xl overflow-hidden bg-card">
                <div className="border-b border-border px-6 py-4 flex justify-between items-center">
                  <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-accent" />
                    Productos
                  </h2>
                  {loading && (
                    <span className="text-xs text-muted-foreground animate-pulse">
                      Actualizando...
                    </span>
                  )}
                </div>
                {/* Passing props to ProductTable */}
                <ProductTable
                  products={filteredProducts}
                  loading={loading}
                  error={error}
                  onSale={openSaleModal}
                  onAddStock={openAddStockModal}
                  onEdit={openEditModal}
                />
              </div>
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="flex flex-col gap-6">
            {/* Sale Button (General Action) */}
            <SaleButton
              isLoading={actionLoading}
              onClick={handleMainSaleClick}
            />

            {/* Quick Actions */}
            <div className="border border-border rounded-xl bg-card p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-destructive" />
                Acciones
              </h3>
              <div className="space-y-3">
                <button 
                  onClick={() => setIsReportModalOpen(true)}
                  className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
                >
                  Ver Reportes
                </button>
                <button 
                  onClick={() => setIsExportModalOpen(true)}
                  className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
                >
                  Exportar Datos
                </button>
                <button 
                  onClick={() => setIsConfigModalOpen(true)}
                  className="w-full px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors text-sm font-medium"
                >
                  Configuración
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modals */}
      <AddProductModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onProductAdded={handleCreateProduct}
      />

      <SaleModal
        key={isSaleModalOpen ? "open" : "closed"}
        isOpen={isSaleModalOpen}
        onClose={() => setIsSaleModalOpen(false)}
        onConfirm={handleConfirmSale}
        product={selectedProduct}
        products={products}
      />

      <AddStockModal
        key={isAddStockModalOpen ? "open" : "closed"}
        isOpen={isAddStockModalOpen}
        onClose={() => setIsAddStockModalOpen(false)}
        onConfirm={handleConfirmAddStock}
        product={selectedProduct}
      />

      <ReportesModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <EditProductModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        product={selectedProduct}
        onProductUpdated={fetchProducts}
      />

      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      <ConfigModal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
      />
    </div>
  );
}
