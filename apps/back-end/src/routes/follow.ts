import { Router } from 'express';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/**
 * POST /users/:id/follow
 * FOLLOW / UNFOLLOW toggle
 */
router.post('/:id/follow', authMiddleware, async (req: AuthRequest, res) => {
  if (!req.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const followingId = req.params.id;

  if (followingId === req.userId) {
    return res.status(400).json({ message: 'Cannot follow yourself' });
  }

  const existing = await prisma.follow.findUnique({
    where: {
      followerId_followingId: {
        followerId: req.userId,
        followingId,
      },
    },
  });

  // ❌ UNFOLLOW
  if (existing) {
    await prisma.$transaction([
      prisma.follow.delete({ where: { id: existing.id } }),

      prisma.user.update({
        where: { id: followingId },
        data: { followersCount: { decrement: 1 } },
      }),

      prisma.user.update({
        where: { id: req.userId },
        data: { followingCount: { decrement: 1 } },
      }),
    ]);

    return res.json({ followed: false });
  }

  // ✅ FOLLOW
  await prisma.$transaction([
    prisma.follow.create({
      data: {
        followerId: req.userId,
        followingId,
      },
    }),

    prisma.user.update({
      where: { id: followingId },
      data: { followersCount: { increment: 1 } },
    }),

    prisma.user.update({
      where: { id: req.userId },
      data: { followingCount: { increment: 1 } },
    }),
  ]);

  return res.json({ followed: true });
});


export default router;
