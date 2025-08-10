const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const notesroutes = require("./notesroutes.js");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/notes", notesroutes);

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
