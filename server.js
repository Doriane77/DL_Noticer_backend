require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./Config/db");
const express = require("express");
const cors = require("cors");

connectDB();
const corsOptions = {
  origin: ["http://127.0.0.1:3000", "http://localhost:3000"],
  optionsSuccessStatus: 204,
};
app = express();

app.use(cors(corsOptions));
app.use(express.json());

const userRoutes = require("./Routes/UserR");
const movieRoutes = require("./Routes/MovieR");
const adminRoutes = require("./Routes/AdminR");
const bookRoutes = require("./Routes/BookR");
const actorRoutes = require("./Routes/ActorR");
const directorRoutes = require("./Routes/DirectorR");
const typeRoutes = require("./Routes/TypeR");
const reviewsRoutes = require("./Routes/ReviewsR");
const authorRoutes = require("./Routes/AuthorR");
const ratingRoutes = require("./Routes/RatingR");

app.use(userRoutes);
app.use(movieRoutes);
app.use(adminRoutes);
app.use(bookRoutes);
app.use(actorRoutes);
app.use(directorRoutes);
app.use(typeRoutes);
app.use(reviewsRoutes);
app.use(authorRoutes);
app.use(ratingRoutes);

app.all("*", (req, res) => {
  res.status(404).send("Page introuvable");
});

app.listen(process.env.PORT || 3200, () => {
  console.log(`Server started at port ${process.env.PORT}`);
});
