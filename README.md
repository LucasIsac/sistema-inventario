# Sistema de Inventario Inteligente (MERN + n8n)

Sistema de gestión de inventarios desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js) que integra automatización mediante **n8n**. Su objetivo principal es mantener un control en tiempo real del stock de productos y notificar proactivamente cuando las existencias caen por debajo de los niveles permitidos.

---

## 🚀 Características

### Gestión de Productos
- ✅ Listado de productos con búsqueda por nombre o SKU
- ✅ Creación de nuevos productos con atributos detallados (SKU, Precio Compra/Venta, Proveedor, Stock Mínimo)
- ✅ **Edición de productos**: Click sobre cualquier producto para modificar precios y datos
- ✅ Visualización de ganancia por unidad en tiempo real

### Control de Stock
- ✅ **Registro de Ventas**: Disminuye el stock del producto seleccionado
- ✅ **Reabastecimiento**: Permite agregar stock a productos existentes
- ✅ Historial completo de ventas guardado en base de datos

### Dashboard en Tiempo Real
- ✅ Cálculo automático del valor total del inventario
- ✅ Conteo de productos con stock bajo
- ✅ Gráficos de distribución por categoría y niveles de inventario
- ✅ **Ventas del día**: Ingresos, unidades vendidas, ticket promedio

### Reportes
- ✅ Reportes por período: Hoy, Esta Semana, Este Mes
- ✅ Productos vendidos con ingresos por producto
- ✅ Detalle de ventas con fechas y totales

### Exportación de Datos
- ✅ **Inventario Completo**: Productos con precios, stock, valor total y estado
- ✅ **Historial de Ventas**: Detalle de transacciones por período
- ✅ **Resumen de Ventas**: Comparativa Hoy vs Semana vs Mes
- ✅ **Kardex**: Movimientos de inventario con rentabilidad
- ✅ Formato CSV optimizado para Excel (compatible con Argentina)

### Configuración
- ✅ Nombre de empresa personalizable
- ✅ Selección de moneda (ARS, USD, EUR)
- ✅ Alertas de stock bajo activables
- ✅ Actualización automática configurable

### Integraciones
- ✅ **n8n**: Notificaciones automáticas cuando el stock cae por debajo del mínimo
- ✅ Webhook configurado para conectar con flujos de trabajo

---

## 🛠 Arquitectura Técnica

| Componente | Tecnología | Descripción |
| :--------- | :--------- | :---------- |
| **Backend** | Node.js + Express | API RESTful con validación y seguridad |
| **Base de Datos** | MongoDB (Atlas/Local) | Almacena productos y ventas |
| **Frontend** | React + Vite + Tailwind | Interfaz moderna y responsiva (SPA) |
| **Integración** | n8n + Ngrok | Automatización de alertas vía Webhooks |

---

## 📦 Instalación

### Prerrequisitos
- Node.js (v18+)
- MongoDB (corriendo localmente o URI de Atlas)
- (Opcional) n8n instalado o cuenta cloud + Ngrok

### 1. Clonar el repositorio

```bash
git clone https://github.com/LucasIsac/sistema-inventario.git
cd sistema-inventario
```

### 2. Configuración del Backend

```bash
cd backend
npm install
```

Crea un archivo `.env` en `backend/` con:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/inventario
N8N_WEBHOOK_URL=https://tu-webhook-n8n.com/webhook/...
```

Inicia el servidor:

```bash
npm run dev
```

### 3. Configuración del Frontend

```bash
cd frontend
npm install
npm run dev
```

La aplicación estará disponible en `http://localhost:5173`

---

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
| :----- | :------- | :---------- |
| `GET` | `/api/products` | Obtiene todos los productos |
| `POST` | `/api/products` | Crea un nuevo producto |
| `PUT` | `/api/products/:sku` | Actualiza un producto |
| `POST` | `/api/products/venta` | Registra una venta (descarta stock) |
| `POST` | `/api/products/add-stock` | Agrega stock a un producto |
| `GET` | `/api/products/ventas-hoy` | Obtiene ventas del día |
| `GET` | `/api/products/reportes?period=day\|week\|month` | Reportes por período |

---

## 📊 Moneda

El sistema está configurado para trabajar con **Pesos Argentinos (ARS)** por defecto. Los precios se muestran en formato `$` con separador de miles.

---

## 🔧 Tecnologías Utilizadas

### Backend
- Express.js
- Mongoose
- express-validator
- Helmet (seguridad)
- CORS
- Axios

### Frontend
- React 19
- Vite
- Tailwind CSS 4
- Recharts
- Axios
- Lucide React
- React Router DOM

---

## 📝 Licencia

ISC

---

## 👤 Autor

Lucas Isaac De la Fuente
