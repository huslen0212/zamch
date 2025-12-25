import { Router } from "express";
import prisma from "../prisma";

const router = Router();

/**
 * GET /leaderboard
 * sortBy = likes | followers | posts
 */
router.get("/", async (req, res) => {
  try {
    const sortBy = String(req.query.sortBy || "followers");

    let orderBy: any = {};

    if (sortBy === "likes") {
      orderBy = { totalLikes: "desc" };
    } else if (sortBy === "posts") {
      orderBy = { postsCount: "desc" };
    } else {
      // default → followers
      orderBy = { followersCount: "desc" };
    }

    const users = await prisma.user.findMany({
      orderBy,
      take: 50,
      select: {
        id: true,
        name: true,
        avatar: true,
        location: true,
        lat: true,
        lng: true,

        totalLikes: true,
        followersCount: true,
        postsCount: true,
        countriesVisited: true,
      },
    });

    return res.json(users);
  } catch (e) {
    console.error("LEADERBOARD ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
