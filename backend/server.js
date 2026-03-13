const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const dotenv = require("dotenv");
const connectDB = require("./config/db");

dotenv.config();

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api/products", require("./routes/productRoutes"));

app.use((req, res) => {
  res.status(404).json({ message: "Endpoint no encontrado" });
});

app.use((err, req, res, next) => {
  console.error("Error:", err.message);
  res.status(500).json({ 
    message: process.env.NODE_ENV === "development" ? err.message : "Error interno del servidor" 
  });
});

const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("✅ Base de datos conectada");
    
    app.listen(PORT, () => {
      console.log(`✅ Servidor corriendo en puerto ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Error al iniciar el servidor:", error.message);
    process.exit(1);
  }
};

startServer();
