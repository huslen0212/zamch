import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";
import jwt from "jsonwebtoken";
import { authMiddleware, AuthRequest } from "../middleware/auth";


const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Мэдээлэл дутуу байна",
      });
    }

    const exists = await prisma.user.findUnique({
      where: { email },
    });

    if (exists) {
      return res.status(400).json({
        message: "Энэ и-мэйл аль хэдийн бүртгэлтэй",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
  data: {
    name,
    email,
    password: hashedPassword,

    avatar:
      "https://images.unsplash.com/photo-1585624196654-d78397524a51?auto=format&fit=crop&w=256&q=80",
    bio: "Шинэ хэрэглэгч",

    location: location?.name ?? null,
    lat: location?.lat ?? null,
    lng: location?.lng ?? null,

    postsCount: 0,
    totalLikes: 0,
    followers: 0,
    following: 0,
    countriesVisited: 0,
  },
});


    return res.status(201).json({
      success: true,
    });
  } catch (error) {
    console.error("REGISTER ERROR:", error);
    return res.status(500).json({
      message: "Server error",
    });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Мэдээлэл дутуу байна" });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "И-мэйл эсвэл нууц үг буруу байна" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "И-мэйл эсвэл нууц үг буруу байна" });
    }

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      console.error("JWT_SECRET is not defined");
      return res.status(500).json({ message: "Server configuration error" });
    }

    const token = jwt.sign(
      { userId: user.id },
      jwtSecret,
      { expiresIn: "3h" }
    );

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        location: user.location,
      },
    });
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
   select: {
    id: true,
    name: true,
    email: true,
    avatar: true,
    bio: true,
    location: true,
    lat: true,
    lng: true,
    postsCount: true,
    totalLikes: true,
    followers: true,
    following: true,
    countriesVisited: true,
    createdAt: true,
}
  });

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.json(user);
});

export default router;
