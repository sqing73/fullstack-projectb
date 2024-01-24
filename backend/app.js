require("dotenv").config();
const express = require("express");
const { connectDB, disconnectDB } = require("./db");
const hrRoutes = require("./routers/hr");
const employeeRoutes = require("./routers/employee");
const errorHandler = require("./middlewares/errorHandler");
const { signin: employeeSignin } = require("./controllers/employee");
const { signin: hrSignin } = require("./controllers/hr");

const app = express();
connectDB();

const cors = require("cors");
const morgan = require("morgan");

const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use("/assets/userFiles", express.static(__dirname + "/assets/userFiles"));
app.use(
  "/assets/userAvatars",
  express.static(__dirname + "/assets/userAvatars")
);

app.get("/server-status", (req, res, next) => {
  res.status(200).json({ message: "Server is up and running!" });
});

app.post("/signin", employeeSignin, hrSignin);

app.use("/hr", hrRoutes);
app.use("/employee", employeeRoutes);

// add routes above this line

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
