import { errorHandler } from "../utils/error.js";
import Post from "../models/post.model.js";
export const create = async (req, res, next) => {
  if (!req.body.title || !req.body.content) {
    return next(errorHandler(500, "Please provide all required fields"));
  }
  console.log(req.body, "body");

  !req.body.category ? delete req.body.category : "";
  console.log(req.body, "body");
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

export const getposts = async (req, res, next) => {
  try {
    // const startIndex = parseInt(req.query.startIndex) || 0;

    const page = parseInt(req.query.page) || 1;
    const startIndex = (page - 1) * page;

    const limit = parseInt(req.query.limit) || 9;

    const sortDirection = req.query.order === "asc" ? 1 : -1;
    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    const totalPosts = await Post.countDocuments();

    const now = new Date();

    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );

    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const getpostByPage = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const startIndex = (page - 1) * pageSize;
    const limit = pageSize;

    const sortDirection = req.query.order === "asc" ? 1 : -1;

    console.log(req.query.category);
    console.log(req.query.order);
    console.log(req.query.searchTerm);

    const posts = await Post.find({
      ...(req.query.userId && { userId: req.query.userId }),
      ...(req.query.category && { category: req.query.category }),
      ...(req.query.slug && { slug: req.query.slug }),
      ...(req.query.postId && { _id: req.query.postId }),
      ...(req.query.searchTerm && {
        $or: [
          { title: { $regex: req.query.searchTerm, $options: "i" } },
          { content: { $regex: req.query.searchTerm, $options: "i" } },
        ],
      }),
    })
      .sort({ updatedAt: sortDirection })
      .skip(startIndex)
      .limit(limit);

    //统计数量添加限定条件
    const totalPosts = await Post.countDocuments({
      ...(req.query.userId && { userId: req.query.userId }),
    });

    const now = new Date();
    const oneMonthAgo = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      now.getDate()
    );
    //统计数量添加限定条件
    const lastMonthPosts = await Post.countDocuments({
      createdAt: { $gte: oneMonthAgo },
      ...(req.query.userId && { userId: req.query.userId }),
    });

    res.status(200).json({
      posts,
      totalPosts,
      lastMonthPosts,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteposts = async (req, res, next) => {
  // console.log(req.params.postId,req.params.userId)
  // next(new Error("失败"));
  // return
  console.log(req.user);
  console.log(req.user.id);
  console.log(req.params.userId);
  console.log(!req.user.isAdmin);
  console.log(req.user.id !== req.params.userId);

  if (!req.user.isAdmin && req.user.id !== req.params.userId) {
    // if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to delete this post"));
  }
  try {
    await Post.findByIdAndDelete(req.params.postId);
    res.status(200).json("The post has been deleted");
  } catch (error) {
    next(error);
  }
};

export const updatepost = async (req, res, next) => {
  if (!req.user.isAdmin || req.user.id !== req.params.userId) {
    return next(errorHandler(403, "You are not allowed to update this post"));
  }
  try {
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: {
          title: req.body.title,
          content: req.body.content,
          category: req.body.category,
          image: req.body.image,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedPost);
  } catch (error) {
    next(error);
  }
};
