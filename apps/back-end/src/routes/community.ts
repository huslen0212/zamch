import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ======================================================
   COMMUNITY USERS
   GET /community/travelers
====================================================== */
router.get("/travelers", async (_req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        posts: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { imageUrl: true },
        },
        _count: {
          select: { posts: true },
        },
      },
    });

    const result = users.map((u, index) => ({
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      title: "Аялагч", // UI-д таарах placeholder
      countriesVisited: 20 + index, // placeholder
      postsCount: u._count.posts,
      followers: 5000 + index * 1200, // placeholder
      bio: u.bio || "Аялагч, блог хөтлөгч",
      recentPhoto:
        u.posts[0]?.imageUrl ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
    }));

    return res.json(result);
  } catch (e) {
    console.error("COMMUNITY ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
