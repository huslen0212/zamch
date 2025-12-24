import { Router } from 'express';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const posts = await prisma.post.findMany({
      where: {
        authorId: req.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return res.json(posts);
  } catch (error) {
    console.error('FETCH MY POSTS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
