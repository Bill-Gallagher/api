import express from "express";
import { verifyToken } from "../utils/verifyUser.js";
import {
  create,
  getposts,
  getpostByPage,
  deleteposts
} from "../controllers/post.controller.js";

const router = express.Router();
router.post("/create", verifyToken, create);
// router.get('/getposts', getposts)
router.get("/getposts",verifyToken, getpostByPage);
router.delete("/deletepost/:postId/:userId", verifyToken, deleteposts);

export default router;
