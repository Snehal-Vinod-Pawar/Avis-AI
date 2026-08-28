import express from "express";
import cors from "cors";
// import bodyParser from "body-parser";
import proxy from "express-http-proxy";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import protect from "./middleware/auth.middleware.js";
import getCurrentUser from "./controllers/user.controller.js";
import { proxyWithHeaders } from "./utils/proxyWithHeaders.js";
import morgan from "morgan";

dotenv.config();

const port = process.env.PORT || 8000;

const app = express();
// Allowlist: production frontend URL via env, plus localhost for local dev.
// If origin is not in the list, CORS headers are simply not sent (no crash).
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

app.use(morgan("dev"))

app.use(cookieParser());
app.use("/api/auth", proxy(process.env.AUTH_SERVICE));
app.use("/api/chat",protect,proxyWithHeaders(process.env.CHAT_SERVICE));
app.use("/api/agent",protect,proxy(process.env.AGENT_SERVICE));
app.get("/api/me", protect,getCurrentUser);

app.get("/", (req, res) => {
  res.send("Hello from Gateway");
});

app.listen(port, () => {
  console.log(`Gateway started on port ${port}`);
} )

