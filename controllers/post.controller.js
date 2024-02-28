import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(500,"Please provide all required fields"));
  }
  //   得到的 slug 就是一个 URL-friendly 的字符串，适合在 URL 中使用，因为它只包含小写字母、数字和连字符，且单词之间用连字符分隔。
  const slug = req.body.title
    .split(" ")
    .join("-")
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "");
  const newPost = new Post({
    ...req.body,
    slug,
    userId: req.user.id,
  });
  try {
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    next(error);
  }
};
