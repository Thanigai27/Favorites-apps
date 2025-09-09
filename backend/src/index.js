import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import authRoutes from "./routes/authRoutes.js";
import entryRoutes from "./routes/entryRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import fs from "fs";

const app = express();
app.use(cors());
app.use(express.json());

// ensure uploads folder exists
if (!fs.existsSync("uploads")) fs.mkdirSync("uploads");

app.use("/uploads", express.static("uploads"));
app.use("/api/auth", authRoutes);
app.use("/api/entries", entryRoutes);

app.get("/health", (_req, res) => res.json({ ok: true }));

app.use(errorHandler);

app.listen(PORT, () => console.log(`Backend listening at http://localhost:${PORT}`));
