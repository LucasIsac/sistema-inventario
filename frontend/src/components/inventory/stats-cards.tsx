"use client"

import type React from "react"

import { Package, AlertTriangle, DollarSign } from "lucide-react"

const StatsCard = ({
  icon: Icon,
  label,
  value,
  change,
  changeColor,
}: {
  icon: React.ElementType
  label: string
  value: string
  change: string
  changeColor: string
}) => {
  return (
    <div className="border border-border rounded-xl bg-card p-6 hover:border-accent/50 transition-colors">
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
  )
}

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <StatsCard
        icon={Package}
        label="Valor Total del Inventario"
        value="$125,430"
        change="+12.5% este mes"
        changeColor="text-emerald-400"
      />
      <StatsCard
        icon={AlertTriangle}
        label="Productos en Alerta"
        value="8"
        change="3 críticos"
        changeColor="text-destructive"
      />
      <StatsCard
        icon={DollarSign}
        label="Ventas Hoy"
        value="$4,250"
        change="+8.2% vs ayer"
        changeColor="text-emerald-400"
      />
    </div>
  )
}
