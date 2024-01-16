require("dotenv").config();
const express = require("express");
const app = express();
const port = 7000;

const cors = require("cors");

app.use(cors());

//db connection
const dbConnection = require("./db/dbConfig");

//user routes middleware file
const userRoutes = require("./routes/userRoute");

//questions routes middleware file
const questionRouter = require("./routes/questionRoute");
const answerRouter = require("./routes/answerRoute");

//authentication midddleware file
const authMiddleware = require("./middleware/authMiddleware");

//json middleware to extract json data
app.use(express.json());

//user routes middleware
app.use("/api/users", userRoutes);

//questions routes middleware
app.use("/api/questions", authMiddleware, questionRouter);

//answers routes middleware

app.use("/api/answers", authMiddleware, answerRouter);
async function start() {
  try {
    const result = await dbConnection.execute("SELECT 'test'");
    await app.listen(port);
    console.log("Database connection established");
    console.log(`Listening on ${port}`);
  } catch (error) {
    console.log(error.message);
  }
}

start();
