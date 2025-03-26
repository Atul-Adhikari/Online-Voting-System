require("dotenv/config");
const express = require("express");
const mongoose = require("mongoose");
const app = express();
const PORT = 3333;

app.use(express.json());

const usersRoute = require("./routes/users");
const pollsRoute = require("./routes/polls");

app.use("/users", usersRoute);
app.use("/polls", pollsRoute);

app.get("/", (req, res) => {
  res.send("Hello world.");
});

// Connect to the DB
async function connectDB() {
  try {
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL is not defined in .env file");
    }
    await mongoose.connect(process.env.DATABASE_URL);
    console.log("Database connected");
  } catch (error) {
    console.error("Database connection failed:", error);
    process.exit(1);
  }
}

connectDB();

app.listen(PORT, () => console.log(`Alive on http://localhost:${PORT}`));