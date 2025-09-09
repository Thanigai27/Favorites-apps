import { Router } from "express";
import multer from "multer";
import {
  createEntry, listEntries, getMyEntries,
  approveEntry, updateEntry, softDeleteEntry
} from "../controllers/entryController.js";
import { requireAuth, requireRole } from "../middleware/auth.js";

const router = Router();

// local uploads to ./uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

router.get("/", requireAuth, listEntries);
router.get("/mine", requireAuth, getMyEntries);
router.post("/", requireAuth, upload.single("poster"), createEntry);
router.put("/:id", requireAuth, updateEntry);
router.delete("/:id", requireAuth, softDeleteEntry);

// admin routes
router.put("/:id/approve", requireAuth, (req, res, next) => {
  if (req.user.role !== "admin") return res.status(403).json({ error: "Admin only" });
  next();
}, approveEntry);

export default router;
