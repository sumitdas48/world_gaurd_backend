const express = require("express");
const router = express.Router();
const { productKeyModel } = require("../Models/productKeysModel");



// Create a new product key
router.post("/productKeys", async (req, res) => {
  try {
    const productKey = req.body;
    const createdProductKey = await productKeyModel.create(productKey);
    res.status(201).json(createdProductKey);
  } catch (err) {
    res.status(500).json({ error: "Failed to create product key" });
  }
});



// Get all product keys
router.get("/productKeys", async (req, res) => {
  try {
    const productKeys = await productKeyModel.find();
    res.status(200).json(productKeys);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve product keys" });
  }
});

router.get("/productKeys/total", async (req, res) => {
  try {
    const productKeys = await productKeyModel.find();
    const totalProducts = productKeys.length;
    res.status(200).json({ totalProducts });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve product keys" });
  }
});

// Get a specific product key by ID
router.get("/productKeys/:id", async (req, res) => {
  try {
    const productKey = await productKeyModel.findById(req.params.id);
    if (!productKey) {
      return res.status(404).json({ error: "Product key not found" });
    }
    res.status(200).json(productKey);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve product key" });
  }
});

// Get product details by product key
router.get("/productKeys/key/:productKey", async (req, res) => {
  try {
    const productKey = await productKeyModel.findOne({
      productKey: req.params.productKey
    });
    if (!productKey) {
      return res.status(404).json({ error: "Product key not found" });
    }
    res.status(200).json(productKey);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve product details" });
  }
});

// Get products by dealer code
router.get("/productKeys/dealer/:dealerCode", async (req, res) => {
  try {
    const products = await productKeyModel.find({
      dealerCode: req.params.dealerCode
    });
    if (products.length === 0) {
      return res.status(404).json({ error: "No products found for the dealer code" });
    }
    res.status(200).json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve products" });
  }
});

// Update a specific product key by ID
router.patch("/productKeys/:id", async (req, res) => {
  try {
    const productKey = await productKeyModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!productKey) {
      return res.status(404).json({ error: "Product key not found" });
    }
    res.status(200).json(productKey);
  } catch (err) {
    res.status(500).json({ error: "Failed to update product key" });
  }
});

// Update a specific product key by product key value
router.patch("/productKeys/key/:productKey", async (req, res) => {
    try {
      const productKey = await productKeyModel.findOneAndUpdate(
        { productKey: req.params.productKey },
        req.body,
        { new: true }
      );
      if (!productKey) {
        return res.status(404).json({ error: "Product key not found" });
      }
      res.status(200).json(productKey);
    } catch (err) {
      res.status(500).json({ error: "Failed to update product key" });
    }
  });

// Delete a specific product key by ID
router.delete("/productKeys/:id", async (req, res) => {
  try {
    const productKey = await productKeyModel.findByIdAndRemove(req.params.id);
    if (!productKey) {
      return res.status(404).json({ error: "Product key not found" });
    }
    res.status(200).json({ message: "Product key deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete product key" });
  }
});

router.get("/totalActivated", async (req, res) => {
  try {
    console.log("Activated count route accessed"); // Add this log to check if the route is being accessed
    const activatedProductKeysCount = await productKeyModel.countDocuments({ isActivated: true });
    console.log("Activated count:", activatedProductKeysCount); // Add this log to see the count value
    res.status(200).json({ activatedProductKeysCount });
  } catch (err) {
    console.error("Error retrieving activated product key count:", err); // Add this log to see any errors that occur
    res.status(500).json({ error: "Failed to retrieve activated product key count" });
  }
});


// Get the count of activated product keys matching the dealerCode parameter
router.get("/productKeys/dealer/:dealerCode/activatedCount", async (req, res) => {
  try {
    const dealerCode = req.params.dealerCode;

    // Find all activated product keys for the specified dealerCode
    const activatedProductKeys = await productKeyModel.find({
      dealerCode: dealerCode,
      isActivated: true
    });

    // Get the count of activated product keys
    const activatedProductKeysCount = activatedProductKeys.length;

    res.status(200).json({ activatedProductKeysCount });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve activated product key count" });
  }
});

router.get("/stockActivated", async (req, res) => {
  try {
    const count = await productKeyModel.countDocuments({
      demo: { $exists: false },
      isActivated: true,
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve count" });
  }
});
router.get("/stockAvailable", async (req, res) => {
  try {
    const count = await productKeyModel.countDocuments({
      demo: { $exists: false },
      isActivated: false,
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve count" });
  }
});
router.get("/demoActivated", async (req, res) => {
  try {
    const count = await productKeyModel.countDocuments({
      demo: { $exists: true },
      isActivated: true,
    });
    res.status(200).json({ count });
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve count" });
  }
});
// Get activated stocks (isActivated is true and demo field is not present)
router.get("/activatedStocks", async (req, res) => {
  try {
    const activatedStocks = await productKeyModel.find({
      isActivated: true,
      demo: { $exists: false },
    });
    res.status(200).json(activatedStocks);
  } catch (err) {
    res.status(500).json({ error: "Failed to retrieve activated stocks" });
  }
});



module.exports = router;
