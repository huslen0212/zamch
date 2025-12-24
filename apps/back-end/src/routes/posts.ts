import { Router } from 'express';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

/* =========================================
   Helper: Relative time
========================================= */
function getRelativeTime(date: Date): string {
  const now = Date.now();
  const diffMs = now - date.getTime();

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return 'Дөнгөж сая';
  if (minutes < 60) return `${minutes} минутын өмнө`;
  if (hours < 24) return `${hours} цагийн өмнө`;
  return `${days} өдрийн өмнө`;
}

/* =========================================
   CREATE POST
========================================= */
router.post('/', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { title, excerpt, content, category, imageUrl, location } = req.body;

    if (!title || !excerpt || !content || !category || !imageUrl) {
      return res.status(400).json({ message: 'Мэдээлэл дутуу байна' });
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
        authorId: req.userId,
      },
    });

    await prisma.user.update({
      where: { id: req.userId },
      data: { postsCount: { increment: 1 } },
    });

    return res.status(201).json(post);
  } catch (error) {
    console.error('CREATE POST ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* =========================================
   GET ALL POSTS (HOME PAGE)
========================================= */
router.get('/', async (_req, res) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true },
        },
      },
    });

    return res.json(
      posts.map((post) => ({
        id: post.id,
        image: post.imageUrl,
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author.name,
        date: post.createdAt,
        readTime: getRelativeTime(post.createdAt),
      }))
    );
  } catch (error) {
    console.error('FETCH POSTS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* =========================================
   MY POSTS
========================================= */
router.get('/me', authMiddleware, async (req: AuthRequest, res) => {
  try {
    if (!req.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const posts = await prisma.post.findMany({
      where: { authorId: req.userId },
      orderBy: { createdAt: 'desc' },
    });

    return res.json(posts);
  } catch (error) {
    console.error('FETCH MY POSTS ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

/* =========================================
   SINGLE POST
========================================= */
router.get('/:id', async (req, res) => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid post id' });
    }

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            avatar: true,
            bio: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.json({
      id: post.id,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      image: post.imageUrl,
      createdAt: post.createdAt,
      readTime: getRelativeTime(post.createdAt), 
      author: post.author.name,
      authorAvatar: post.author.avatar,
      authorBio: post.author.bio,
    });
  } catch (error) {
    console.error('GET POST ERROR:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

export default router;
