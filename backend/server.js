
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const Food = require("./models/Food");
const app = express();

app.use(cors());
app.use(express.json());

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "OK", message: "Food API is running" });
});

// Get all foods and search
app.get("/api/foods", async (req, res) => {
  try {
    const { search } = req.query;
    let filter = {};

    if (search) {
      filter = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { category: { $regex: search, $options: "i" } },
          { cuisine: { $regex: search, $options: "i" } },
          { foodId: { $regex: search, $options: "i" } },
        ],
      };
    }

    const foods = await Food.find(filter);
    res.status(200).json(foods);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

 
// Get one food by MongoDB ID
app.get("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({
      message: "Invalid food ID",
    });
  }
});

 
// Add a new food
app.post("/api/foods", async (req, res) => {
  try {
    const {
      foodId,
      name,
      category,
      cuisine,
      ingredients,
      price,
      quantity,
      description,
      imageUrl,
    } = req.body;

    if (
      !foodId ||
      !name ||
      !category ||
      !cuisine ||
      price === undefined ||
      quantity === undefined
    ) {
      return res.status(400).json({
        message: "Please provide all required fields",
      });
    }

    const existingFood = await Food.findOne({ foodId });

    if (existingFood) {
      return res.status(409).json({
        message: "Food ID already exists",
      });
    }

    const newFood = await Food.create({
      foodId,
      name,
      category,
      cuisine,
      ingredients,
      price,
      quantity,
      description,
      imageUrl,
    });

    res.status(201).json(newFood);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

 
// Update a food by MongoDB ID
app.put("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.status(200).json(food);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
});

 
// Delete a food by MongoDB ID
app.delete("/api/foods/:id", async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        message: "Food not found",
      });
    }

    res.status(200).json({
      message: "Food deleted successfully",
      food,
    });
  } catch (error) {
    res.status(400).json({
      message: "Invalid food ID",
    });
  }
});


// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGODB_URI)
  .then(async () => {
    console.log("Connected to MongoDB Atlas");
    console.log("Database:", mongoose.connection.name);
    console.log("Collection:", Food.collection.name);

    const count = await Food.countDocuments();
    console.log("Number of foods:", count);

    const PORT = process.env.PORT || 5000;
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("MongoDB connection error:", error.message);
  });
