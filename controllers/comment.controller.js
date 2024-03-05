import { errorHandler } from "../utils/error.js";
import Comment from "../models/comment.model.js";

export const createComment = async (req, res, next) => {
  try {
    const { content, postId, userId } = req.body;

    if (userId !== req.user.id) {
      return next(
        errorHandler(403, "You are not allowed to create this comment")
      );
    }

    const newComment = new Comment({
      content,
      postId,
      userId,
    });
    await newComment.save();

    res.status(200).json(newComment);
  } catch (error) {
    next(error);
  }
};

export const getPostComments = async (req, res, next) => {
  try {
    const comments = await Comment.find({ postId: req.params.postId }).sort({
      createdAt: -1,
    });
    res.status(200).json(comments);
  } catch (error) {
    next(error);
  }
};

export const likeComment = async (req, res, next) => {
  try {
    //根据评论号码，查询评论实体
    const comment = await Comment.findById(req.params.commentId);
    if (!comment) {
      next(errorHandler(404, "Comment not found"));
    }
    //获取评论的liks数组
    const userIndex = comment.likes.indexOf(req.user.id);
    if (userIndex === -1) {
      comment.numberOfLikes += 1;
      comment.likes.push(req.user.id);
    } else {
      comment.numberOfLikes -= 1;
      comment.likes.splice(userIndex, 1);
    }
    await comment.save();
    res.status(200).json(comment);
  } catch (error) {
    next(error);
  }
};

//编辑评论
export const editComment = async (req, res, next) => {

  try {
    //根据评论号码，查询评论实体
    const comment = await Comment.findById(req.params.commentId);
    // console.log(comment)
    if (!comment) {
      next(errorHandler(404, "Comment not found"));
    }
    if (comment.userId !== req.user.id) {
      next(errorHandler(403, "You are not allowed to edit this comment"));
    }
    const editComment = await Comment.findByIdAndUpdate(
      req.params.commentId,
      {
        content: req.body.content,
      },
      { new: true } //选项表示返回更新后的文档而不是原始文档。
    );
    console.log(editComment,222)
    res.status(200).json(editComment);
  } catch (error) {
    next(error);
  }
};
