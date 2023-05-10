import express from "express";
import xss from "xss";
import {
  deleteComment,
  // editComment,
  // getCommentsByPostId,
  likeComment,
  postComment,
  unlikeComment,
} from "../data/comments.js";
const router = express.Router();

router
  .route("/:postId")
  .post(async (req, res) => {
    try {
      const postedComment = await postComment(
        req.params.postId,
        xss(req.body.userEmail),
        xss(req.body.userThatPosted),
        xss(req.body.comment)
      );
      res.json(postedComment);
    } catch (error) {
      res.status(error.code).send(error.message);
    }
  });
  router.route("/:postId/:commentId")
  .delete(async (req, res) => {
    try {
      const postAfterDeletion = await deleteComment(
        req.params.postId,
        req.params.commentId,
      );
      res.json(postAfterDeletion);
    } catch (error) {
      console.log(error);
      res.status(error.code).send(error.message);
    }
  });

// .patch(async (req, res) => {
//   try {
//     const { commentId, comment } = req.body;
//     const postAfterUpdate = await editComment(
//       req.params.postId,
//       commentId,
//       xss(comment)
//     );
//     res.json(postAfterUpdate);
//   } catch (error) {
//     res.status(error.code).send(error.message);
//   }
// });

router.route("/:postId/:commentId").post(async (req, res) => {
  try {
    const { userThatPosted } = req.body;
    const commentLiked = await likeComment(
      userThatPosted,
      req.params.postId,
      req.params.commentId
    );
    res.json(commentLiked);
  } catch (error) {
    console.log(error);
    res.status(error.code).send(error.message);
  }
});
router.route("/:postId/:commentId/:userThatPosted").delete(async (req, res) => {
  try {
    const commentUnliked = await unlikeComment(
      req.params.userThatPosted,
      req.params.postId,
      req.params.commentId
    );
    res.json(commentUnliked);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});
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
// });

export default router;
