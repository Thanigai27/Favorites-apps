import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";
import { prisma } from "../utils/prisma.js";

export async function requireAuth(req, res, next) {
  try {
    const h = req.headers.authorization;
    if (!h) return res.status(401).json({ error: "Missing Authorization header" });
    const parts = h.split(" ");
    if (parts.length !== 2) return res.status(401).json({ error: "Malformed Authorization header" });
    const token = parts[1];
    const payload = jwt.verify(token, JWT_SECRET);
    // fetch user minimal
    const user = await prisma.user.findUnique({ where: { id: payload.id } });
    if (!user) return res.status(401).json({ error: "User not found" });
    req.user = { id: user.id, email: user.email, role: user.role, username: user.username };
    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid token", detail: err.message });
  }
}

export function requireRole(role) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "Not authenticated" });
    if (req.user.role !== role) return res.status(403).json({ error: "Forbidden" });
    next();
  };
}
