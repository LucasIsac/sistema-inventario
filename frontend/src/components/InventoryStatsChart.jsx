import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Badge } from "@/components/ui/badge";

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-xl">
        <p className="font-semibold text-foreground mb-2">{label}</p>
        <p className="text-sm text-emerald-500">
          Stock Actual: <span className="font-bold">{payload[0].value}</span>
        </p>
        <p className="text-sm text-destructive">
          Stock Mínimo: <span className="font-bold">{payload[1].value}</span>
        </p>
      </div>
    );
  }
  return null;
};

export default function InventoryStatsChart({ products }) {
  // Filter only low stock products or sort by lowest quantity
  const data = [...products]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 7) // Show top 7 lowest stock
    .map((p) => ({
      name: p.name,
      stock: p.quantity,
      minStock: p.minStock,
    }));

  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-accent/20">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-foreground">
            Stocks Críticos
          </h3>
          <p className="text-sm text-muted-foreground">
            Productos con menor existencia
          </p>
        </div>
        <Badge variant="outline" className="bg-secondary/20">
          Top 7
        </Badge>
      </div>

      <div className="h-[300px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--muted)"
              strokeOpacity={0.4}
            />
            <XAxis
              dataKey="name"
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              interval={0}
              tick={{ fontSize: 10 }}
            />
            <YAxis
              stroke="var(--muted-foreground)"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip
              content={<CustomTooltip />}
              cursor={{ fill: "var(--muted)", fillOpacity: 0.4 }}
            />
            <Legend wrapperStyle={{ paddingTop: "20px" }} />
            <Bar
              name="Stock Actual"
              dataKey="stock"
              fill="var(--primary)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
            <Bar
              name="Stock Mínimo"
              dataKey="minStock"
              fill="var(--destructive)"
              radius={[4, 4, 0, 0]}
              barSize={30}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
