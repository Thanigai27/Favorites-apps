import prisma from "../prismaClient.js"; // Your Prisma instance

/**
 * Create a new entry
 */
export const createEntry = async (data, user) => {
  return prisma.favorite.create({
    data: {
      title: data.title,
      type: data.type,
      director: data.director,
      budget: data.budget,
      location: data.location,
      duration: data.duration,
      year: data.year,
      imageUrl: data.imageUrl,
      userId: user.id,
      approved: user.role === "admin" ? true : false, // auto approve if admin
    },
  });
};

/**
 * Get all entries
 * - Admin → sees all entries
 * - User → sees only approved entries + their own pending
 */
export const getEntries = async (user) => {
  if (user.role === "admin") {
    return prisma.favorite.findMany({
      where: { deleted: false },
      include: { user: true },
      orderBy: { createdAt: "desc" },
    });
  }

  return prisma.favorite.findMany({
    where: {
      deleted: false,
      OR: [
        { approved: true },
        { userId: user.id }, // show their pending ones too
      ],
    },
    orderBy: { createdAt: "desc" },
  });
};

/**
 * Update an entry
 */
export const updateEntry = async (id, data, user) => {
  const entry = await prisma.favorite.findUnique({ where: { id } });

  if (!entry) throw new Error("Entry not found");

  if (user.role !== "admin" && entry.userId !== user.id) {
    throw new Error("Not authorized to update this entry");
  }

  return prisma.favorite.update({
    where: { id },
    data: {
      ...data,
      approved: user.role === "admin" ? data.approved : entry.approved,
    },
  });
};

/**
 * Soft delete an entry
 */
export const deleteEntry = async (id, user) => {
  const entry = await prisma.favorite.findUnique({ where: { id } });

  if (!entry) throw new Error("Entry not found");

  if (user.role !== "admin" && entry.userId !== user.id) {
    throw new Error("Not authorized to delete this entry");
  }

  return prisma.favorite.update({
    where: { id },
    data: { deleted: true },
  });
};

/**
 * Approve an entry (Admin only)
 */
export const approveEntry = async (id, user) => {
  if (user.role !== "admin") {
    throw new Error("Not authorized to approve entries");
  }

  return prisma.favorite.update({
    where: { id },
    data: { approved: true },
  });
};
