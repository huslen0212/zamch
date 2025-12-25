import { Router } from "express";
import prisma from "../prisma";

const router = Router();

// Public user profile
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        avatar: true,
        bio: true,
        location: true,
        lat: true,
        lng: true,
        postsCount: true,
        totalLikes: true,
        followersCount: true,
        followingCount: true,
        countriesVisited: true,
        createdAt: true,
      },
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.json({ ...user, joinDate: user.createdAt });
  } catch (e) {
    console.error("GET USER ERROR:", e);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
