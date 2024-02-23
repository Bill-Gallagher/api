import mongoose from "mongoose";

const Schema = mongoose.Schema;

// 定义一个模式
const userSchema = new Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
  },
  { timestamps: true }
);

// 创建 User 模型
const User = mongoose.model("User", userSchema);
export default User;
