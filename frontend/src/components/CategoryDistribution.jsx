import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

const COLORS = [
  "#10b981", // emerald-500
  "#3b82f6", // blue-500
  "#f59e0b", // amber-500
  "#ef4444", // red-500
  "#8b5cf6", // violet-500
  "#ec4899", // pink-500
  "#06b6d4", // cyan-500
  "#6366f1", // indigo-500
];

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background/95 backdrop-blur-sm border border-border p-3 rounded-lg shadow-xl">
        <p className="font-semibold text-foreground mb-1">{payload[0].name}</p>
        <p className="text-sm text-muted-foreground">
          Cantidad:{" "}
          <span className="font-bold text-foreground">{payload[0].value}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {(payload[0].percent * 100).toFixed(0)}% del total
        </p>
      </div>
    );
  }
  return null;
};

export default function CategoryDistribution({ data }) {
  return (
    <div className="bg-card border border-border/60 rounded-xl p-6 shadow-md hover:shadow-lg transition-all duration-200 hover:border-accent/20">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">
          Distribución por Categoría
        </h3>
        <p className="text-sm text-muted-foreground">Productos por tipo</p>
      </div>

      <div className="h-[300px] w-full relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={100}
              paddingAngle={5}
              dataKey="value"
              stroke="var(--card)"
              strokeWidth={2}
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="bottom"
              height={36}
              iconType="circle"
              iconSize={8}
            />
          </PieChart>
        </ResponsiveContainer>

        {/* Center Text (Optional) */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none pb-8">
          <span className="text-3xl font-bold text-foreground">
            {data.reduce((acc, curr) => acc + curr.value, 0)}
          </span>
          <p className="text-xs text-muted-foreground uppercase tracking-wider">
            Total
          </p>
        </div>
      </div>
    </div>
  );
}
