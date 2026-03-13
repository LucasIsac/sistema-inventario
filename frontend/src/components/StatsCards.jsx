import { Package, AlertTriangle, DollarSign } from "lucide-react";

// eslint-disable-next-line no-unused-vars
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

export default function StatsCards({ stats }) {
  const { totalValue = 0, lowStockCount = 0, totalProducts = 0 } = stats || {};

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        icon={Package}
        label="Valor Total del Inventario"
        value={formatCurrency(totalValue)}
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
        icon={DollarSign}
        label="Ventas Hoy"
        value="$0" // Placeholder until we have sales history
        change="Sin datos aún"
        changeColor="text-muted-foreground"
      />
    </div>
  );
}
