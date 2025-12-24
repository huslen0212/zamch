import { Router } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const {
      title,
      excerpt,
      content,
      category,
      imageUrl,
      location,
    } = req.body;

    if (!title || !excerpt || !content || !category || !imageUrl) {
      return res.status(400).json({ message: "Мэдээлэл дутуу байна" });
    }

    const post = await prisma.post.create({
      data: {
        title,
        excerpt,
        content,
        category,
        imageUrl,
        location: location?.name ?? null,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
        authorId: req.userId!,
      },
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: { postsCount: { increment: 1 } },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error("CREATE POST ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;
