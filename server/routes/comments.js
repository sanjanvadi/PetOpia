import express from "express";
import {
  deleteComment,
  editComment,
  getCommentByCommentId,
  getCommentsByPostId,
  likeComment,
  postComment,
  unlikeComment,
} from "../data/comments.js";
import { ObjectId } from "mongodb";
const router = express.Router();

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      const allCommentsByPostId = await getCommentsByPostId(req.params.postId);
      res.json(allCommentsByPostId);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .post(async (req, res) => {
    const user = new ObjectId();
    try {
      const postedComment = await postComment(
        req.params.postId,
        user.toString(),
        req.body.comment
      );
      res.json(postedComment);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const { commentId } = req.body;
      const postAfterDeletion = await deleteComment(
        req.params.postId,
        commentId
      );
      res.json(postAfterDeletion);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .patch(async (req, res) => {
    try {
      const { commentId, comment } = req.body;
      const postAfterUpdate = await editComment(
        req.params.postId,
        commentId,
        comment
      );
      res.json(postAfterUpdate);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });

router
  .route("/:postId/:commentId")
  // .get(async (req, res) => {
  //   try {
  //     const commentById = await getCommentByCommentId(
  //       req.params.postId,
  //       req.params.commentId
  //     );
  //     res.json(commentById);
  //   } catch (error) {
  //     res.status(error.code).send(error.message);
  //   }
  // })
  .post(async (req, res) => {
    try {
      const commentLiked = await likeComment(
        req.session.user._id,
        req.params.postId,
        req.params.commentId
      );
      res.json(commentLiked);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  })
  .delete(async (req, res) => {
    try {
      const commentUnliked = await unlikeComment(
        req.session.user._id,
        req.params.postId,
        req.params.commentId
      );
      res.json(commentUnliked);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });

router
  .route("/:postId/likes")
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
