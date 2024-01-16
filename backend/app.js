require("dotenv").config();
const express = require("express");
const { connectDB, disconnectDB } = require("./db");
const hrRoutes = require("./routers/hr");
const errorHandler = require("./middlewares/errorHanlder");

const app = express();
connectDB();

const cors = require("cors");
const morgan = require("morgan");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.get("/server-status", (req, res, next) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.use("/hr", hrRoutes);

// add routes above

app.use(errorHandler);

app.use((req, res) => {
  res.status(404).json({ message: "Path not found" });
});

process.on("SIGINT", async () => {
  await disconnectDB();
});

app.listen(PORT, () => {
  console.log(`Employee management app listening at http://localhost:${PORT}`);
});
