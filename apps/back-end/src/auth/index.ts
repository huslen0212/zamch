import { Router } from "express";
import bcrypt from "bcryptjs";
import prisma from "../prisma";

const router = Router();

router.post("/register", async (req, res) => {
  try {
    const { name, email, password, location } = req.body;

    if (!name || !email || !password || location) {
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
        location: location?.name ?? null,
        lat: location?.lat ?? null,
        lng: location?.lng ?? null,
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

export default router;
