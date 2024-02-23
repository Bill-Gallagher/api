import User from "../models/user.model.js";
import bcryptjs from "bcryptjs"
export const signup = async (req, res) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return res.status(400).json({ message: "All fields are required" });
  }
  //password: 要哈希的原始密码。
  //10:哈希的成本因子（也称为“盐”）
  const hashPassword=bcryptjs.hashSync(password,10)
  const newUser = new User({ username, email, password:hashPassword });
  try {
    await newUser.save();
    res.json({ message: "signup!" });
  } catch (error) {
    res.status(500).json({
      message: error,
    });
  }
};
