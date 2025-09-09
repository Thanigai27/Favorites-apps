import { prisma } from "../utils/prisma.js";
import fs from "fs";
import path from "path";

export async function createEntry(req, res) {
  try {
    // required fields: title, type
    const { title, type, director, budget, location, duration, year } = req.body;
    if (!title || !type) return res.status(400).json({ error: "title and type required" });

    // poster: multer puts file in req.file (optional)
    let posterPath = null;
    if (req.file) {
      posterPath = `/uploads/${req.file.filename}`;
    }

    const entry = await prisma.entry.create({
      data: {
        title, type, director, budget, location, duration, year,
        poster: posterPath,
        createdById: req.user.id,
        approved: false
      }
    });

    return res.status(201).json({ entry });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: err.message });
  }
}

export async function listEntries(req, res) {
  try {
    // Cursor pagination: ?cursor=<id>&limit=20
    const limit = Math.min(Number(req.query.limit ?? 10), 50);
    const cursorId = req.query.cursor ? Number(req.query.cursor) : undefined;

    // visibility rules:
    // - if admin: see all (excluding soft deleted)
    // - if user: see approved entries OR own entries (including pending)
    let where = { isDeleted: false };

    if (req.user.role === "user") {
      where = {
        isDeleted: false,
        OR: [
          { approved: true },
          { createdById: req.user.id }
        ]
      };
    }

    const findArgs = {
      where,
      orderBy: { id: "desc" },
      take: limit
    };

    if (cursorId) {
      findArgs.skip = 1;
      findArgs.cursor = { id: cursorId };
    }

    const items = await prisma.entry.findMany(findArgs);

    const nextCursor = items.length === limit ? items[items.length - 1].id : null;

    return res.json({ items, nextCursor });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function getMyEntries(req, res) {
  try {
    const items = await prisma.entry.findMany({
      where: { createdById: req.user.id, isDeleted: false },
      orderBy: { createdAt: "desc" }
    });
    return res.json({ items });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function approveEntry(req, res) {
  try {
    const id = Number(req.params.id);
    const entry = await prisma.entry.update({
      where: { id },
      data: { approved: true }
    });
    return res.json({ entry });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function updateEntry(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.entry.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    // only admin or owner
    if (req.user.role !== "admin" && existing.createdById !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    const data = req.body;
    const updated = await prisma.entry.update({ where: { id }, data });
    return res.json({ entry: updated });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}

export async function softDeleteEntry(req, res) {
  try {
    const id = Number(req.params.id);
    const existing = await prisma.entry.findUnique({ where: { id } });
    if (!existing) return res.status(404).json({ error: "Not found" });
    if (req.user.role !== "admin" && existing.createdById !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }
    await prisma.entry.update({ where: { id }, data: { isDeleted: true } });
    return res.json({ ok: true });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
