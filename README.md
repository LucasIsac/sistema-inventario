# Sistema de Inventario Inteligente (MERN + n8n)

Este proyecto es un sistema de gestión de inventarios desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js) que integra automatización mediante **n8n**. Su objetivo principal es mantener un control en tiempo real del stock de productos y notificar proactivamente cuando las existencias caen por debajo de los niveles permitidos.

---

## 🚀 Estado Actual del Proyecto

El sistema es un **prototipo funcional** que permite la gestión básica del inventario y la automatización de alertas. La aplicación es capaz de realizar operaciones CRUD sobre productos, gestionar entradas y salidas de stock, y conectarse con servicios externos vía Webhooks.

### ✅ Qué hace el sistema (Funcionalidades)

1.  **Gestión de Productos**:
    - Listado de productos con búsqueda por nombre o SKU.
    - Creación de nuevos productos con atributos detallados (SKU, Precio Compra/Venta, Proveedor, Stock Mínimo, etc.).
2.  **Control de Stock**:
    - **Registro de Ventas**: Disminuye el stock del producto seleccionado.
    - **Reabastecimiento**: Permite agregar stock a productos existentes.
3.  **Dashboard en Tiempo Real**:
    - Cálculo automático del valor total del inventario.
    - Conteo de productos con stock bajo.
    - Gráficos de distribución por categoría y niveles de inventario.
4.  **Automatización con n8n**:
    - Detecta automáticamente cuando una venta reduce el stock por debajo del `minStock`.
    - Envía una notificación (payload JSON) a un webhook de n8n para gatillar flujos de trabajo (ej. enviar email, alerta a Slack, crear pedido a proveedor).

### ❌ Qué NO hace / Limitaciones actuales

- **No hay Autenticación**: El sistema es abierto; no hay login ni roles de usuario (admin/empleado).
- **Sin Historial de Ventas**: Las "ventas" solo descuentan el stock numérico. **No se guarda un registro histórico** de las transacciones (quién vendió, cuándo, total de la venta, etc.).
- **Botones "Mockup"**: En el dashboard, los botones de "Ver Reportes", "Exportar Datos" y "Configuración" son visuales y no tienen funcionalidad implementada.
- **Validación Simplificada**: Si bien hay validaciones básicas, faltan manejos de errores avanzados en el frontend para casos de borde.

---

## 🛠 Arquitectura Técnica

El proyecto se divide en dos partes principales:

| Componente        | Tecnología              | Descripción                                                  |
| :---------------- | :---------------------- | :----------------------------------------------------------- |
| **Backend**       | Node.js + Express       | API RESTful que maneja la lógica de negocio y conexión a DB. |
| **Base de Datos** | MongoDB (Atlas/Local)   | Almacena la colección de `products`.                         |
| **Frontend**      | React + Vite + Tailwind | Interfaz de usuario moderna y responsiva (SPA).              |
| **Integración**   | n8n + Ngrok             | Automatización de alertas vía Webhooks.                      |

### Integración con n8n

La "magia" ocurre en el controlador de ventas (`productController.js`).

1.  Cuando se registra una venta (`POST /api/products/venta`), el sistema verifica: `stock_actual < stock_minimo`.
2.  Si es verdadero, el backend envía una petición POST a la URL definida en `N8N_WEBHOOK_URL` junto con los datos del producto.
3.  **Nota**: Para entornos de desarrollo local, se requiere **Ngrok** para exponer el puerto local a internet si n8n está en la nube.

---

## 📦 Instalación y Uso

### Prerrequisitos

- Node.js (v14+)
- MongoDB (corriendo localmente o URI de Atlas)
- (Opcional) n8n instalado o cuenta cloud + Ngrok

### 1. Configuración del Backend

1.  Navega a la carpeta `backend`:
    ```bash
    cd backend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  Crea un archivo `.env` en `backend/` con lo siguiente:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/tu_base_de_datos
    N8N_WEBHOOK_URL=https://tu-webhook-n8n.com/webhook/...
    ```
4.  Inicia el servidor:
    ```bash
    npm run dev
    ```

### 2. Configuración del Frontend

1.  Navega a la carpeta `frontend`:
    ```bash
    cd frontend
    ```
2.  Instala las dependencias:
    ```bash
    npm install
    ```
3.  (Opcional) Configura el proxy si es necesario en `vite.config.js` (por defecto asume backend en puerto 5000 o usa proxy conf).
4.  Inicia la aplicación:
    ```bash
    npm run dev
    ```

---

## 📡 Endpoints Principales

| Método | Endpoint                  | Descripción                                                                   |
| :----- | :------------------------ | :---------------------------------------------------------------------------- |
| `GET`  | `/api/products`           | Obtiene todos los productos.                                                  |
| `POST` | `/api/products`           | Crea un nuevo producto.                                                       |
| `POST` | `/api/products/venta`     | Reduce stock. **Dispara alerta n8n si es necesario**. body: `{sku, quantity}` |
| `POST` | `/api/products/add-stock` | Aumenta stock. body: `{sku, quantity}`                                        |

---

## 🔮 Próximos Pasos (Roadmap)

1.  Implementar Login/Registro (JWT).
2.  Crear modelo `Sale` para guardar historial de transacciones.
3.  Implementar funcionalidad real de reportes y exportación (CSV/PDF).
4.  Mejorar manejo de errores y validaciones de formularios en el Frontend.
