import express from "express";
import {
  createPost,
  deletePost,
  getAllPosts,
  getPostById,
} from "../data/communityPosts.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router
  .route("/")
  .get(async (req, res) => {
    try {
      const allPosts = await getAllPosts(req.query.page);
      res.json(allPosts);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .post(async (req, res) => {
    try {
      const { postImage, postTitle, postCaption} = req.body;
      const userId = new ObjectId();
      const newPost = await createPost(
        // req.session.user._id.toString(),
        userId.toString(),
        postImage,
        postTitle,
        postCaption
      );
      res.json(newPost);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      const postById = await getPostById(req.params.postId);
      res.json(postById);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      await getPostById(req.params.postId);
      const deleteInfo = await deletePost(req.params.postId);
      res.json(deleteInfo);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });
export default router;
