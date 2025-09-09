import { prisma } from "../utils/prisma.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config.js";

export async function signup(req, res) {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) return res.status(400).json({ error: "username,email,password required" });
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: "Email already registered" });
    const hash = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({ data: { username, email, password: hash } });
    // do not return password
    return res.status(201).json({ user: { id: user.id, username: user.username, email: user.email, role: user.role }});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: "email,password required" });
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) return res.status(400).json({ error: "Invalid credentials" });
    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: "8h" });
    return res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role }});
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
