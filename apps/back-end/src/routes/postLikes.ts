import { Router } from 'express';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /posts/:id/like
 * LIKE / UNLIKE toggle
 */
router.post('/:id/like', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const postId = Number(req.params.id);
    if (isNaN(postId)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const existing = await prisma.postLike.findUnique({
      where: {
        userId_postId: {
          userId: req.userId,
          postId,
        },
      },
    });

    // 🔁 UNLIKE
    if (existing) {
      await prisma.postLike.delete({
        where: { id: existing.id },
      });

      await prisma.user.update({
        where: { id: req.userId },
        data: { totalLikes: { decrement: 1 } },
      });

      return res.json({ liked: false });
    }

    // ❤️ LIKE
    await prisma.postLike.create({
      data: {
        userId: req.userId,
        postId,
      },
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: { totalLikes: { increment: 1 } },
    });

    return res.json({ liked: true });
  } catch (error) {
    console.error('LIKE ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /posts/:id/likes
 */
router.get('/:id/likes', async (req, res) => {
  const postId = Number(req.params.id);

  if (isNaN(postId)) {
    return res.status(400).json({ message: 'Invalid post id' });
  }

  const count = await prisma.postLike.count({
    where: { postId },
  });

  return res.json({ count });
});

export default router;
