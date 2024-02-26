import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";
import cookieParser from "cookie-parser";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log(err);
  });

const app = express();
// 设置 JSON 请求主体的最大大小为10MB（根据你的需求调整）
app.use(express.json({ limit: '10mb' }));

// express.json() 中间件会解析传入请求的 JSON 数据，然后将其转换成 JavaScript 对象
app.use(express.json());
// 使用 express.urlencoded() 中间件来解析 x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: true }));
// 使用cookie-parser中间件
app.use(cookieParser());

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);

//错误处理中间件
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internet Server Error";
  res.status(statusCode).json({
    success: false,
    statusCode,
    message,
  });
});
