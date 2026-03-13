"use client"

import { Badge } from "@/components/ui/badge"

interface Product {
  id: number
  name: string
  category: string
  price: number
  stock: number
  maxStock: number
}

const products: Product[] = [
  { id: 1, name: 'Laptop Pro 15"', category: "Electrónica", price: 1299.99, stock: 12, maxStock: 20 },
  { id: 2, name: "Mouse Inalámbrico", category: "Accesorios", price: 29.99, stock: 3, maxStock: 50 },
  { id: 3, name: "Teclado Mecánico RGB", category: "Accesorios", price: 149.99, stock: 8, maxStock: 30 },
  { id: 4, name: 'Monitor 4K 32"', category: "Electrónica", price: 599.99, stock: 5, maxStock: 15 },
  { id: 5, name: "Hub USB-C", category: "Accesorios", price: 79.99, stock: 1, maxStock: 25 },
  { id: 6, name: "Webcam Full HD", category: "Electrónica", price: 89.99, stock: 18, maxStock: 40 },
  { id: 7, name: "Auriculares Pro", category: "Audio", price: 349.99, stock: 6, maxStock: 20 },
  { id: 8, name: "Cable HDMI 2.1", category: "Cables", price: 24.99, stock: 2, maxStock: 60 },
]

const ProgressBar = ({ value, max, isLow }: { value: number; max: number; isLow: boolean }) => {
  const percentage = (value / max) * 100

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-sm font-medium text-foreground">
          {value} / {max}
        </span>
        <span className="text-xs text-muted-foreground">{Math.round(percentage)}%</span>
      </div>
      <div className="w-full bg-secondary/50 rounded-full h-2 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${isLow ? "bg-destructive" : "bg-accent"}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  )
}

export default function ProductTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-secondary/30 border-b border-border">
          <tr>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Producto</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Categoría</th>
            <th className="px-6 py-4 text-right text-sm font-semibold text-foreground">Precio</th>
            <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Stock</th>
            <th className="px-6 py-4 text-center text-sm font-semibold text-foreground">Estado</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, idx) => {
            const isLowStock = product.stock <= 5
            const stockPercentage = (product.stock / product.maxStock) * 100

            return (
              <tr
                key={product.id}
                className={`border-b border-border hover:bg-secondary/20 transition-colors ${idx % 2 === 0 ? "bg-card/50" : ""}`}
              >
                <td className="px-6 py-4 text-sm font-medium text-foreground">{product.name}</td>
                <td className="px-6 py-4 text-sm text-muted-foreground">{product.category}</td>
                <td className="px-6 py-4 text-sm font-semibold text-right text-accent">${product.price.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <ProgressBar value={product.stock} max={product.maxStock} isLow={isLowStock} />
                </td>
                <td className="px-6 py-4 text-center">
                  {isLowStock ? (
                    <Badge className="bg-destructive hover:bg-destructive text-white">Stock Bajo</Badge>
                  ) : (
                    <Badge className="bg-emerald-600 hover:bg-emerald-700 text-white">Normal</Badge>
                  )}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
