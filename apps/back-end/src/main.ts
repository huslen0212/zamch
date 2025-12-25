import leaderboardRoutes from './routes/leaderboard';
import express from "express";
import cors from "cors";

import authRoutes from "./auth";
import postRoutes from "./routes/posts";
import communityRoutes from "./routes/community";
import postLikeRoutes from "./routes/postLikes";
import followRoutes from "./routes/follow";
import usersRouter from "./routes/users";
const app = express();

app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

app.use('/auth', authRoutes);
app.use('/posts', postRoutes);
app.use('/community', communityRoutes)
app.use('/posts', postLikeRoutes);
app.use('/leaderboard', leaderboardRoutes);
app.use("/users", followRoutes);
app.use("/usersInfo", usersRouter);

app.listen(3001, () => {
  console.log("🚀 Backend running on http://localhost:3001");
});
