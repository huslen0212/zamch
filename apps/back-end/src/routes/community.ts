import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/* ======================================================
   COMMUNITY USERS
   GET /community/travelers?take=30&skip=0
====================================================== */
router.get("/travelers", async (req, res) => {
  try {
    const takeRaw = Number(req.query.take ?? 30);
    const skipRaw = Number(req.query.skip ?? 0);

    const take = Number.isFinite(takeRaw) ? Math.min(Math.max(takeRaw, 1), 50) : 30;
    const skip = Number.isFinite(skipRaw) ? Math.max(skipRaw, 0) : 0;

    const users = await prisma.user.findMany({
      take,
      skip,
      orderBy: [{ followersCount: "desc" }, { postsCount: "desc" }, { id: "asc" }],
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,

        // ✅ бодит тоонууд (counter талбарууд)
        countriesVisited: true,
        postsCount: true,
        followersCount: true,
        totalLikes: true,

        // ✅ хамгийн сүүлийн постын зураг
        posts: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: { imageUrl: true },
        },
      },
    });

    const result = users.map((u) => ({
      id: u.id,
      name: u.name ?? "Нэргүй",
      avatar: u.avatar || "/default-avatar.png",
      title: "Аялагч", // хүсвэл role/level-ээс тооцоолж болно
      countriesVisited: u.countriesVisited ?? 0,
      postsCount: u.postsCount ?? 0,
      followers: u.followersCount ?? 0,
      bio: u.bio || "Аялагч, блог хөтлөгч",
      recentPhoto:
        u.posts?.[0]?.imageUrl ||
        "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      totalLikes: u.totalLikes ?? 0, // хэрэгтэй бол UI-д харуулж болно
    }));

    return res.json(result);
  } catch (e) {
    console.error("COMMUNITY ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
