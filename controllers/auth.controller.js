import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

//注册控制器
export const signup = async (req, res, next) => {
  const { username, email, password } = req.body;
  if (
    !username ||
    !email ||
    !password ||
    username === "" ||
    email === "" ||
    password === ""
  ) {
    return next(errorHandler(400, "All fields are required"));
  }

  if (username.length < 6 || username > 20) {
    return next(
      errorHandler(400, "Username must be between 6 and 20 characters")
    );
  }
  if (password.length < 6) {
    return next(errorHandler(400, "Password must be at least 6 characters"));
  }

  //password: 要哈希的原始密码。
  //10:哈希的成本因子（也称为“盐”）
  const hashPassword = bcryptjs.hashSync(password, 10);
  const newUser = new User({ username, email, password: hashPassword });
  try {
    await newUser.save();
    res.status(200).json({
      statusCode: 200,
      message: "Signup Success",
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

//登录控制器
export const signin = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password || email === "" || password === "") {
    console.log(2);
    return next(errorHandler(400, "All fields are required"));
  }

  try {
    // 数据库通过email进行查询
    const validUser = await User.findOne({ email });
    if (!validUser) {
      return next(errorHandler(404, "User not found"));
    }
    //解密密码，校验密码是否正确
    const validPassword = bcryptjs.compareSync(password, validUser.password);
    if (!validPassword) {
      return next(errorHandler(400, "Invalid password"));
    }
    // 根据用户信息生成JWT 密钥
    const token = jwt.sign(
      { id: validUser._id, isAdmin: validUser.isAdmin },
      process.env.JWT_SECRET
    );

    //validUser._doc 来获取原始的 JavaScript 对象。
    const { password: pass, ...rest } = validUser._doc;
    // 其中 httpOnly: true 意味着该 cookie 仅可通过 HTTP 请求访问，而不可通过客户端脚本（如 JavaScript）访问。
    // 以防止通过 XSS（跨站脚本）攻击来获取 cookie 中的敏感信息。
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};
