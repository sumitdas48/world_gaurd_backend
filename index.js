const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const { connection } = require("./config/db")


// Import and use the product key router
const productKeyRouter = require("./Router/productRouter");

// Middleware and app configurations
app.use(express.json());
app.use(cors());
app.get("/", (req, res) => {
    res.send("This API is Private ");
  });
app.use("/products",productKeyRouter);

// Start the server
app.listen(process.env.PORT, async () => {

    console.log("Starting the server...");
  try {
    await connection;
    console.log("Connected to the database");
  } catch (err) {
    console.error("Failed to connect to the database:", err);
  }
  console.log("Server is running on port", process.env.PORT);
});
