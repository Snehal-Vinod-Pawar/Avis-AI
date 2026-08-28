import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import router from "./routes/auth.routes.js";

dotenv.config();

const port = process.env.PORT || 8001;

const app = express();
// Allowlist: production frontend URL via env, plus localhost for local dev.
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:4173",
  "http://localhost:3000"
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    return callback(null, false);
  },
  credentials: true
}));
app.use(express.json())

app.use("/",router)
app.get("/", (req, res) => {
  res.send("Hello from Auth Service");
});

app.listen(port, () => {
  console.log(`Auth Service started on port ${port}`);
  connectDB();
} )

