import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import userRoutes from "./routes/user.route.js";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
mongoose
  .connect(process.env.MONGO)
  .then(() => console.log("Connected!"))
  .catch((err) => {
    console.log(err);
  });



const app = express();
// express.json() 中间件会解析传入请求的 JSON 数据，然后将其转换成 JavaScript 对象
app.use(express.json());
// 使用 express.urlencoded() 中间件来解析 x-www-form-urlencoded 格式的请求体
app.use(express.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});

app.use("/api/user", userRoutes);
app.use("/api/auth", authRoutes);
