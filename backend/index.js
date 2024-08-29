// Import necessary packages
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

// Load environment variables from .env file
require("dotenv").config();

// Initialize Express application
const app = express();

// Middleware to enable CORS and parse JSON requests
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB using the connection string from environment variables
mongoose.connect(
  process.env.MONGODB_URI, // Use MONGODB_URI from .env file
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

// Define Mongoose schema and model for Movie
const movieSchema = new mongoose.Schema({
  title: String,
  rating: Number,
});

const Movie = mongoose.model("Movie", movieSchema);

// Define API routes

// Create a new movie
app.post("/movies", async (req, res) => {
  const { title, rating } = req.body;
  const movie = new Movie({ title, rating });
  await movie.save();
  res.json(movie);
});

// Get all movies
app.get("/movies", async (req, res) => {
  const movies = await Movie.find();
  res.json(movies);
});

// Update a movie by ID
app.put("/movies/:id", async (req, res) => {
  const { title, rating } = req.body;
  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { title, rating },
    { new: true }
  );
  res.json(movie);
});

// Delete a movie by ID
app.delete("/movies/:id", async (req, res) => {
  await Movie.findByIdAndDelete(req.params.id);
  res.json({ message: "Movie deleted" });
});

// Start the server using the port number from environment variables
const PORT = process.env.PORT || 5000; // Use PORT from .env file or default to 5000
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
