import express from "express";
import { likePost, unlikePost } from "../data/likes.js";
const router = express.Router();

router
  .route("/:postId")
  .post(async (req, res) => {
    try {
      const { userThatPosted } = req.body;
      const likedData = await likePost(userThatPosted, req.params.postId);
      res.json({ likedData: likedData });
    } catch (error) {
      console.log(error);
      res.status(error.code).send(error.message);
    }
  });
  router
  .route("/:postId/:userId")
  .delete(async (req, res) => {
    try {
      // const { userThatPosted } = req.body;
      const unlikedData = await unlikePost(req.params.userId, req.params.postId);
      res.json({ unlikedData: unlikedData });
    } catch (error) {
      console.log(error);
      res.status(error.code).send(error.message);
    }
  });

export default router;
