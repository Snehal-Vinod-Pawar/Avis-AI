import express from "express";
// import cors from "cors";
// import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/agent.route.js";

dotenv.config();

const port = process.env.PORT || 8002;

const app = express();
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true
// }));
app.use(express.json())
app.use("/",router)
app.get("/", (req, res) => {
  res.send("Hello from Agent Service");
});

app.listen(port, () => {
  console.log(`Agent Service started on port ${port}`);
  connectDB();
} )

