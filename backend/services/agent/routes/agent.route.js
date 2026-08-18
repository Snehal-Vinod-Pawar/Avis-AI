import express from "express"
import { agent, downloadFile } from "../controllers/agent.controller.js"

const router = express.Router()

router.post("/chat",agent)
router.get("/download",downloadFile)

export default router;