import { Loader2, ShoppingCart } from "lucide-react";

export default function SaleButton({ isLoading, onClick }) {
  return (
    <div className="border border-border rounded-xl bg-card p-6">
      <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
        <ShoppingCart className="w-5 h-5 text-accent" />
        Registrar Venta
      </h3>

      <button
        onClick={onClick}
        disabled={isLoading}
        className={`w-full py-3 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-2 ${
          isLoading
            ? "bg-accent/50 cursor-not-allowed"
            : "bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 active:scale-95"
        }`}
      >
        {isLoading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Procesando...
          </>
        ) : (
          <>
            <ShoppingCart className="w-5 h-5" />
            Registrar Venta
          </>
        )}
      </button>

      <div className="mt-4 p-3 bg-secondary/30 rounded-lg">
        <p className="text-xs text-muted-foreground">
          Selecciona un producto para registrar una venta
        </p>
      </div>
    </div>
  );
}
