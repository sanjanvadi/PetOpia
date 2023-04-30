import express from "express";
import {
  newPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
} from "../data/communityPosts.js";
import { ObjectId } from "mongodb";
import xss from "xss";
const router = express.Router();

router.route("/").get(async (req, res) => {
  try {
    const allData = await getAllPosts(req.query.page);
    res.json({allData: allData, sessionData: req.session.user});
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});
router.route("/").post(async (req, res) => {
  try {
    const { postImage, postTitle, postDescription } = req.body;
    const userId = new ObjectId();
    const addPost = await newPost(
      // req.session.user._id.toString(),
      userId.toString(),
      xss(postImage),
      xss(postTitle),
      xss(postDescription)
    );
    res.json(addPost);
  } catch (error) {
    console.log(error);
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
  .put(async (req, res) => {
    try {
      const { postImage, postTitle, postDescription } = req.body;
      const updatedPost = await editPost(
        req.params.postId,
        // req.session.user._id.toString(),
        "644bad644669bf97ed815029",
        xss(postImage),
        xss(postTitle),
        xss(postDescription)
      );
      res.json(updatedPost);
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
