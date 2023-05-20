import express from "express";
import {
  newPost,
  deletePost,
  editPost,
  getAllPosts,
  getPostById,
  searchPosts,
} from "../data/communityPosts.js";
import xss from "xss";
const router = express.Router();
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

router.route("/").get(async (req, res) => {
  try {
    const allData = await getAllPosts(req.query.page);
    const searchedData = await searchPosts(req.query.keyword);
    res.json({ allData: allData, searchedData: searchedData });
  } catch (error) {
    console.log(error);
    res.status(error.code).send(error.message);
  }
});
router.route("/").post(async (req, res) => {
  try {
    const { userThatPosted, userEmail, postImage, postTitle, postDescription } =
      req.body;
    const addPost = await newPost(
      xss(userThatPosted),
      xss(userEmail),
      xss(postImage),
      xss(postTitle),
      xss(postDescription)
    );
    res.json(addPost);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      let postById;
      const postExistsInCache = await client.hExists(
        "posts",
        req.params.postId.toString()
      );
      if (postExistsInCache) {
        postById = await client.hGet("posts", req.params.postId.toString());
        postById = JSON.parse(postById);
      } else {
        postById = await getPostById(req.params.postId);
      }
      res.json(postById);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .put(async (req, res) => {
    try {
      const { userThatPosted, postImage, postTitle, postDescription } =
        req.body;
      const updatedPost = await editPost(
        req.params.postId,
        xss(userThatPosted),
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
