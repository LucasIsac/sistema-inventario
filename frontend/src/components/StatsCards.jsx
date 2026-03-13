import { Package, AlertTriangle, TrendingUp, DollarSign } from "lucide-react";
import { formatCurrency, formatCurrencyShort } from "@/lib/currency";

const StatsCard = ({ icon: Icon, label, value, change, changeColor }) => {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-accent/20">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-muted-foreground text-sm font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
          <p className={`text-sm mt-3 ${changeColor}`}>{change}</p>
        </div>
        <div className="bg-secondary/30 p-3 rounded-lg">
          <Icon className="w-6 h-6 text-accent" />
        </div>
      </div>
    </div>
  );
};

export default function StatsCards({ stats, todaySales }) {
  const { totalValue = 0, lowStockCount = 0, totalProducts = 0 } = stats || {};

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <StatsCard
        icon={Package}
        label="Valor Total del Inventario"
        value={formatCurrencyShort(totalValue)}
        change={`${totalProducts} productos total`}
        changeColor="text-emerald-400"
      />
      <StatsCard
        icon={AlertTriangle}
        label="Productos en Alerta"
        value={lowStockCount}
        change="Requieren atención"
        changeColor="text-destructive"
      />
      <StatsCard
        icon={TrendingUp}
        label="Ventas Hoy"
        value={formatCurrencyShort(todaySales?.totalRevenue || 0)}
        change={`${todaySales?.totalQuantity || 0} unidades • ${todaySales?.totalSales || 0} ventas`}
        changeColor="text-primary"
      />
      <StatsCard
        icon={DollarSign}
        label="Ticket Promedio"
        value={todaySales?.totalSales > 0 
          ? formatCurrency(todaySales.totalRevenue / todaySales.totalSales) 
          : formatCurrency(0)}
        change={todaySales?.totalSales > 0 ? "Por transacción" : "Sin ventas hoy"}
        changeColor="text-muted-foreground"
      />
    </div>
  );
}
