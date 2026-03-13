const axios = require("axios");

const notifyLowStock = async (product) => {
  try {
    if (!process.env.N8N_WEBHOOK_URL) {
      console.warn("N8N_WEBHOOK_URL is not defined in .env");
      return;
    }

    const payload = {
      producto: product.name,
      sku: product.sku,
      stock_actual: product.quantity,
      stock_minimo: product.minStock,
      proveedor: product.supplier,
      categoria: product.category,
      mensaje: `ALERTA STOCK BAJO: El producto ${product.name} (SKU: ${product.sku}) tiene ${product.quantity} unidades. Mínimo requerido: ${product.minStock}. Favor reabastecer con proveedor ${product.supplier}.`,
    };

    console.log("DEBUG: Intentando enviar a:", process.env.N8N_WEBHOOK_URL);

    const response = await axios.post(process.env.N8N_WEBHOOK_URL, payload);

    console.log(
      "DEBUG: Respuesta del servidor:",
      response.status,
      response.data
    );
    console.log(`Low stock notification sent to n8n for ${product.sku}`);
  } catch (error) {
    console.error("Error sending notification to n8n:", error.message);
    if (error.response) {
      console.error("Response Status:", error.response.status);
      console.error("Response Data:", error.response.data);
    }
  }
};

module.exports = { notifyLowStock };
