import { useState } from "react";
import { X, Settings, Save, RefreshCw } from "lucide-react";

export default function ConfigModal({ isOpen, onClose }) {
  const [config, setConfig] = useState({
    currency: "ARS",
    companyName: "Mi Tienda",
    lowStockAlert: true,
    autoRefresh: false,
    refreshInterval: 30,
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setConfig(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    setSaved(false);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      localStorage.setItem("inventory_config", JSON.stringify(config));
      await new Promise(resolve => setTimeout(resolve, 500));
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setConfig({
      currency: "ARS",
      companyName: "Mi Tienda",
      lowStockAlert: true,
      autoRefresh: false,
      refreshInterval: 30,
    });
    setSaved(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div className="bg-card w-full max-w-lg rounded-xl shadow-lg border border-border max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-semibold text-foreground flex items-center gap-2">
            <Settings className="w-5 h-5 text-accent" />
            Configuración
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 overflow-auto">
          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Información General
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  name="companyName"
                  value={config.companyName}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  Moneda
                </label>
                <select
                  name="currency"
                  value={config.currency}
                  onChange={handleChange}
                  className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="ARS">Peso Argentino (ARS)</option>
                  <option value="USD">Dólar Estadounidense (USD)</option>
                  <option value="EUR">Euro (EUR)</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Alertas y Notificaciones
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/30">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Alerta de Stock Bajo
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Notificar cuando el stock esté por debajo del mínimo
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="lowStockAlert"
                  checked={config.lowStockAlert}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                />
              </label>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-foreground mb-4">
              Actualización Automática
            </h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/30">
                <div>
                  <div className="text-sm font-medium text-foreground">
                    Actualización Automática
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Actualizar datos automáticamente cada cierto tiempo
                  </div>
                </div>
                <input
                  type="checkbox"
                  name="autoRefresh"
                  checked={config.autoRefresh}
                  onChange={handleChange}
                  className="w-5 h-5 rounded border-input text-primary focus:ring-primary"
                />
              </label>

              {config.autoRefresh && (
                <div className="space-y-2">
                  <label className="text-sm font-medium text-foreground">
                    Intervalo de actualización (segundos)
                  </label>
                  <input
                    type="number"
                    name="refreshInterval"
                    value={config.refreshInterval}
                    onChange={handleChange}
                    min="10"
                    max="300"
                    className="w-full px-3 py-2 bg-background border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="bg-secondary/30 p-4 rounded-lg">
            <h4 className="text-sm font-medium text-foreground mb-2">
              Acerca del Sistema
            </h4>
            <div className="text-xs text-muted-foreground space-y-1">
              <p>Versión: 1.0.0</p>
              <p>Sistema de Inventario MERN + n8n</p>
              <p>Desarrollado con React, Node.js, MongoDB</p>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between p-6 border-t border-border bg-secondary/20">
          <button
            onClick={handleReset}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Restablecer
          </button>
          
          <button
            onClick={handleSave}
            disabled={saving}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              saved 
                ? "bg-emerald-500 text-white" 
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            } disabled:opacity-50`}
          >
            {saving ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                Guardando...
              </>
            ) : saved ? (
              <>
                <Save className="w-4 h-4" />
                ¡Guardado!
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Guardar Cambios
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
