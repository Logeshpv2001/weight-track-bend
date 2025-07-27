const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const PORT = 5000;

mongoose
  .connect(
    "mongodb+srv://logeshkarnish:Logeshpv%402001@cluster0.jpknhkc.mongodb.net/"
  )
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ MongoDB connection failed:", error.message);
  });

const weightSchema = new mongoose.Schema({
  weight: Number,
  date: Date,
});

const Weight = mongoose.model("Weight", weightSchema);

app.use(cors());
app.use(express.json());

app.get("/api/weights", async (req, res) => {
  const weights = await Weight.find().sort({ date: 1 });
  res.json(weights);
});

app.post("/api/weights", async (req, res) => {
  const { weight, date } = req.body;
  const entry = new Weight({ weight, date });
  await entry.save();
  res.json(entry);
});

// Update weight entry by ID
app.patch("/api/weights/:id", async (req, res) => {
  const { id } = req.params;
  const { weight, date } = req.body;
  try {
    const updated = await Weight.findByIdAndUpdate(
      id,
      { weight, date },
      { new: true }
    );
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: "Update failed" });
  }
});

// Delete weight entry by ID
app.delete("/api/weights/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Weight.findByIdAndDelete(id);
    res.json({ message: "Deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: "Deletion failed" });
  }
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
