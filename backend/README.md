# Backend - Sistema de Inventario Inteligente 📦

Backend robusto desarrollado con el stack **MERN** (MongoDB, Express, React, Node.js) diseñado para gestionar el inventario de productos de forma eficiente y proactiva. Este sistema no solo registra movimientos, sino que incluye automatizaciones inteligentes para alertas de stock bajo.

---

## 🏗 Arquitectura

El proyecto sigue el patrón de arquitectura **MVC (Modelo-Vista-Controlador)** para garantizar una separación clara de responsabilidades y escalabilidad:

- **Modelos (`/models`)**: Definen la estructura de datos y esquemas de MongoDB utilizando Mongoose (ej. `Product.js`).
- **Controladores (`/controllers`)**: Contienen la lógica de negocio. Manejan las peticiones, procesan datos y devuelven respuestas (ej. `productController.js`).
- **Rutas (`/routes`)**: Definen los endpoints de la API y mapean las URL a sus respectivos controladores (ej. `productRoutes.js`).
- **Servicios/Utilidades (`/utils`)**: Módulos auxiliares para lógica externa, como la integración con n8n (`n8nService.js`).

---

## 📡 Documentación de API

### 1. Obtener Productos

Obtiene la lista completa de productos en el inventario.

- **Endpoint:** `GET /api/products`
- **Respuesta:** Array JSON con todos los objetos de producto.

### 2. Registrar Venta (Salida de Stock)

Procesa una venta, disminuye el stock y verifica automáticamente si se debe disparar una alerta de reabastecimiento.

- **Endpoint:** `POST /api/products/venta`
- **Header:** `Content-Type: application/json`
- **Body (Ejemplo JSON):**

```json
{
  "sku": "PROD-001",
  "quantity": 5
}
```

- **Parámetros:**
  - `sku` (String): Identificador único del producto.
  - `quantity` (Number): Cantidad vendida (debe ser mayor a 0).

---

## 🗂 Modelo de Datos (Mongoose)

El esquema de **Product** incluye los siguientes campos:

| Campo        | Tipo   | Descripción                     | Restricciones      |
| :----------- | :----- | :------------------------------ | :----------------- |
| `name`       | String | Nombre del producto             | Requerido, Trim    |
| `sku`        | String | Código único de producto        | Requerido, Único   |
| `quantity`   | Number | Stock actual                    | Default: 0, Min: 0 |
| `minStock`   | Number | Punto de reorden (Stock mínimo) | Default: 10        |
| `salePrice`  | Number | Precio de venta                 | Requerido          |
| `costPrice`  | Number | Precio de costo                 | Requerido          |
| `category`   | String | Categoría del producto          | Requerido          |
| `supplier`   | String | Proveedor del producto          | Requerido          |
| `timestamps` | Date   | Fecha de creación/actualización | Automático         |

---

## 🔄 Integraciones y Automatización

### n8n (Webhooks)

El sistema integra **n8n** para la orquestación de flujos de trabajo automatizados.

- **Trigger:** Cuando se registra una venta y el `quantity` resultante es menor al `minStock`.
- **Acción:** El backend envía un payload JSON a un Webhook de n8n.
- **Payload enviado:**
  - Información del producto (`sku`, `nombre`, `proveedor`, etc.).
  - Mensaje de alerta pre-formateado.

### Ngrok (Túnel Local)

Para permitir que n8n (si está en la nube) o servicios externos se comuniquen con este backend local durante el desarrollo:

1.  Se utiliza **Ngrok** para exponer el puerto local (ej. 5000) a internet.
2.  La URL pública generada por Ngrok se configura en el servicio de n8n o viceversa si se requieren callbacks.
3.  **Configuración:** La URL del webhook de n8n se define en las variables de entorno (`.env`) como `N8N_WEBHOOK_URL`.
