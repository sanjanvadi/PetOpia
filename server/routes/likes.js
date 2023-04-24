import express from "express";
import { likePost, unlikePost } from "../data/likes.js";
const router = express.Router();

router
  .route("/:postId")
  .post(async (req, res) => {
    try {
      const likedData = await likePost(req.session.user._id, req.body.postId);
      res.json(likedData);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const unlikedData = await unlikePost(
        req.session.user._id,
        req.body.postId
      );
      res.json(unlikedData);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });

export default router;
