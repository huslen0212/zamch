import { Router } from 'express';
import prisma from '../prisma';
import { authMiddleware, AuthRequest } from '../middleware/auth';

const router = Router();

// create post
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

// my posts
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

// single post
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
