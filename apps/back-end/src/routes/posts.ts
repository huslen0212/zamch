import { Router } from "express";
import type { Request, Response, NextFunction } from "express";
import prisma from "../prisma";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

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

  if (minutes < 1) return "Дөнгөж сая";
  if (minutes < 60) return `${minutes} минутын өмнө`;
  if (hours < 24) return `${hours} цагийн өмнө`;
  return `${days} өдрийн өмнө`;
}

/* =========================================
   Optional Auth (token байвал req.userId set хийнэ)
========================================= */
type OptionalAuthRequest = AuthRequest & { userId?: string };

function optionalAuth(req: OptionalAuthRequest, _res: Response, next: NextFunction) {
  const header = req.headers?.authorization ?? "";
  if (!header.startsWith("Bearer ")) return next();

  const token = header.slice(7).trim();
  if (!token) return next();

  const secret = process.env.JWT_SECRET;
  if (!secret) return next();

  try {
    const decoded = jwt.verify(token, secret) as any;
    if (decoded?.userId) req.userId = String(decoded.userId);
  } catch {
    // token буруу байсан ч public endpoint ажиллана
  }
  return next();
}

/* =========================================
   Location helpers
========================================= */
const AIMAGS = new Set<string>([
  "Архангай","Баян-Өлгий","Баянхонгор","Булган","Говь-Алтай","Говьсүмбэр",
  "Дархан-Уул","Дорноговь","Дорнод","Дундговь","Завхан","Орхон","Өвөрхангай",
  "Өмнөговь","Сүхбаатар","Сэлэнгэ","Төв","Увс","Ховд","Хөвсгөл","Хэнтий",
]);

type LocationBody =
  | string
  | { name: string; lat?: number | string; lng?: number | string }
  | null
  | undefined;

function toNumberOrNull(v: unknown): number | null {
  if (v === null || v === undefined) return null;
  if (typeof v === "number") return Number.isFinite(v) ? v : null;
  if (typeof v === "string") {
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : null;
  }
  return null;
}

function parseLocation(location: LocationBody): {
  name: string | null;
  lat: number | null;
  lng: number | null;
} {
  if (!location) return { name: null, lat: null, lng: null };

  if (typeof location === "string") {
    const name = location.trim();
    return { name: name || null, lat: null, lng: null };
  }

  const name = String(location.name ?? "").trim() || null;
  const lat = toNumberOrNull(location.lat);
  const lng = toNumberOrNull(location.lng);

  return { name, lat, lng };
}

async function recalcVisitedAimagsCount(tx: Prisma.TransactionClient, userId: string) {
  const distinctLocs = await tx.post.findMany({
    where: { authorId: userId, location: { not: null } },
    distinct: ["location"],
    select: { location: true },
  });

  const visited = distinctLocs
    .map((r: any) => (r.location ?? "").trim())
    .filter((name: string) => AIMAGS.has(name));

  return visited.length;
}

/* =========================================
   Prisma model resolvers (schema нэр зөрөхөд унахгүй)
========================================= */
function resolveLikeClient() {
  const p: any = prisma as any;
  return (
    p.postLike ||  // model PostLike
    p.like ||      // model Like
    p.postLikes || // model PostLikes
    null
  );
}

function resolveFollowClient() {
  const p: any = prisma as any;
  return p.follow || p.userFollow || p.follows || null;
}

/* =========================================
   CREATE POST
   POST /posts
========================================= */
router.post("/", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const { title, excerpt, content, category, imageUrl, location } = req.body;

    if (!title || !excerpt || !content || !category || !imageUrl) {
      return res.status(400).json({ message: "Мэдээлэл дутуу байна" });
    }

    const loc = parseLocation(location as LocationBody);

    const post = await prisma.$transaction(async (tx) => {
      const created = await tx.post.create({
        data: {
          title,
          excerpt,
          content,
          category,
          imageUrl,
          location: loc.name,
          lat: loc.lat,
          lng: loc.lng,
          authorId: req.userId!,
        },
      });

      const postsCount = await tx.post.count({ where: { authorId: req.userId! } });

      let countriesVisited: number | null = null;
      try {
        countriesVisited = await recalcVisitedAimagsCount(tx, req.userId!);
      } catch (e) {
        console.error("VISITED AIMAGS CALC ERROR:", e);
      }

      await tx.user.update({
        where: { id: req.userId! },
        data: {
          postsCount,
          ...(typeof countriesVisited === "number" ? { countriesVisited } : {}),
        },
      });

      return created;
    });

    return res.status(201).json(post);
  } catch (error: any) {
    console.error("CREATE POST ERROR:", error);
    return res.status(500).json({ message: error?.message ?? "Server error" });
  }
});

/* =========================================
   GET ALL POSTS (HOME PAGE)
   GET /posts
========================================= */
router.get("/", async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    });

    return res.json(
      posts.map((post: any) => ({
        id: post.id,
        image: post.imageUrl,
        category: post.category,
        title: post.title,
        excerpt: post.excerpt,
        author: post.author?.name ?? null,
        createdAt: post.createdAt,
        readTime: getRelativeTime(post.createdAt),
        location:post.location ?? '',
      }))
    );
  } catch (error: any) {
    console.error("FETCH POSTS ERROR:", error);
    return res.status(500).json({ message: error?.message ?? "Server error" });
  }
});

/* =========================================
   MY POSTS
   GET /posts/me
========================================= */
router.get("/me", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ message: "Unauthorized" });

    const posts = await prisma.post.findMany({
      where: { authorId: req.userId },
      orderBy: { createdAt: "desc" },
    });

    return res.json(posts);
  } catch (error: any) {
    console.error("FETCH MY POSTS ERROR:", error);
    return res.status(500).json({ message: error?.message ?? "Server error" });
  }
});

/* ======================================================
   CATEGORIES WITH COUNT
   GET /posts/categories/list
====================================================== */
router.get("/categories/list", async (_req: Request, res: Response) => {
  try {
    const grouped = await prisma.post.groupBy({
      by: ["category"],
      _count: { category: true },
    });

    const categoryMeta: Record<string, any> = {
      "Говь цөл": {
        description: "Алтан шаргал элсэн манхан, тэмээн сүрэг болон үлэг гүрвэлийн өлгий нутаг",
        image: "https://images.unsplash.com/photo-1547101133-1463999994c9",
      },
      Уул: {
        description: "Цастай оргил, сүрлэг хад асга бүхий өндөр уулсын гайхамшиг",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b",
      },
      Хангай: {
        description: "Өвс ургамал тэгш, ой мод болон гол горхи хосолсон байгалийн үзэсгэлэн",
        image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e",
      },
      Нуур: {
        description: "Хөх сувд шиг тунгалаг нуурууд, усны шувууд болон амгалан тайван орчин",
        image: "https://images.unsplash.com/photo-1501785888041-af3ef285b470",
      },
    };

    return res.json(
      grouped.map((g: any) => ({
        name: g.category,
        count: g._count.category,
        ...categoryMeta[g.category],
      }))
    );
  } catch (e: any) {
    console.error("CATEGORIES ERROR:", e);
    return res.status(500).json({ message: e?.message ?? "Server error" });
  }
});

/* ======================================================
   POPULAR DESTINATIONS
   GET /posts/popular-destinations
====================================================== */
router.get("/popular-destinations", async (_req: Request, res: Response) => {
  try {
    const posts = await prisma.post.findMany({
      take: 6,
      orderBy: { createdAt: "desc" },
      select: { category: true, imageUrl: true, location: true },
    });

    return res.json(
      posts.map((p: any) => ({
        name: p.location || p.category,
        country: p.category,
        image: p.imageUrl,
      }))
    );
  } catch (e: any) {
    console.error("POPULAR DEST ERROR:", e);
    return res.status(500).json({ message: e?.message ?? "Server error" });
  }
});

/* =========================================
   POSTS BY USER (PUBLIC PROFILE)
   ✅ MUST BE BEFORE "/:id"
   GET /posts/user/:userId?take=20&skip=0
========================================= */
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    const userId = String(req.params.userId || "").trim();
    if (!userId) return res.status(400).json({ message: "Invalid user id" });

    const takeRaw = Number(req.query.take ?? 20);
    const skipRaw = Number(req.query.skip ?? 0);

    const take = Number.isFinite(takeRaw) ? Math.min(Math.max(takeRaw, 1), 50) : 20;
    const skip = Number.isFinite(skipRaw) ? Math.max(skipRaw, 0) : 0;

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true },
    });
    if (!userExists) return res.status(404).json({ message: "User not found" });

    const [total, posts] = await Promise.all([
      prisma.post.count({ where: { authorId: userId } }),
      prisma.post.findMany({
        where: { authorId: userId },
        orderBy: { createdAt: "desc" },
        take,
        skip,
        include: { author: { select: { name: true, avatar: true } } },
      }),
    ]);

    return res.json({
      userId,
      total,
      take,
      skip,
      posts: posts.map((p: any) => ({
        id: p.id,
        image: p.imageUrl,
        category: p.category,
        title: p.title,
        excerpt: p.excerpt,
        content: p.content,
        createdAt: p.createdAt,
        readTime: getRelativeTime(p.createdAt),
        author: p.author?.name ?? null,
        authorAvatar: p.author?.avatar ?? null,
        location: p.location ? { name: p.location, lat: p.lat ?? null, lng: p.lng ?? null } : null,
      })),
    });
  } catch (error: any) {
    console.error("FETCH POSTS BY USER ERROR:", error);
    return res.status(500).json({ message: error?.message ?? "Server error" });
  }
});

/* =========================================
   SINGLE POST (PUBLIC + optional auth)
   GET /posts/:id
========================================= */
router.get("/:id", optionalAuth, async (req: OptionalAuthRequest, res: Response) => {
  try {
    const id = Number(req.params.id);
    if (!Number.isFinite(id)) return res.status(400).json({ message: "Invalid post id" });

    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { name: true, avatar: true, bio: true } },
      },
    });

    if (!post) return res.status(404).json({ message: "Post not found" });

    const viewerId = req.userId;

    // --- likesCount / likedByMe (schema өөр байвал унахгүй)
    const likeClient = resolveLikeClient();
    let likesCount = 0;
    let likedByMe = false;

    if (likeClient?.count) {
      likesCount = await likeClient.count({ where: { postId: post.id } }).catch(() => 0);
    }

    if (viewerId && likeClient?.findFirst) {
      const row = await likeClient
        .findFirst({
          where: { postId: post.id, userId: viewerId },
          select: { userId: true },
        })
        .catch(() => null);
      likedByMe = Boolean(row);
    }

    // --- followedByMe
    const followClient = resolveFollowClient();
    let followedByMe = false;

    if (viewerId && followClient?.findFirst) {
      const f = await followClient
        .findFirst({
          where: { followerId: viewerId, followingId: post.authorId },
          select: { followerId: true },
        })
        .catch(() => null);
      followedByMe = Boolean(f);
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
      authorId: post.authorId,
      author: (post as any).author?.name ?? null,
      authorAvatar: (post as any).author?.avatar ?? null,
      authorBio: (post as any).author?.bio ?? null,
      likesCount,
      likedByMe,
      followedByMe,
    });
  } catch (error: any) {
    console.error("GET POST ERROR:", error);
    return res.status(500).json({ message: error?.message ?? "Server error" });
  }
});

export default router;
