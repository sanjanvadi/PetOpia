import { ObjectId } from "mongodb";
import { communityPosts } from "../config/mongoCollections.js";
import { getPostById } from "./communityPosts.js";
import { validateObjectId, validateString } from "../helpers/validations.js";
import { internalServerError, notFoundError } from "../helpers/wrappers.js";
import moment from "moment";

const getCommentsByPostId = async (postId) => {
  validateObjectId(postId, "Post ID");
  postId = postId.trim();

  const postById = await getPostById(postId);
  if (postById === null) throw notFoundError("Post doesn't exist!");
  postById.postComments.forEach(ele => {
    ele._id = ele._id.toString();
  });
  return postById.postComments;
};

const getCommentByCommentId = async (postId, commentId) => {
  validateObjectId(commentId, "Comment ID");
  validateObjectId(postId, "Post ID");
  commentId = commentId.trim();
  postId = postId.trim();

  const postsCollection = await communityPosts();
  const postWithThatComment = await postsCollection.findOne({
    _id: new ObjectId(postId),
    "postComments._id": new ObjectId(commentId),
  });
  let commentObject = null;
  postWithThatComment.postComments.forEach((element) => {
    if (element._id.toString() === commentId) {
      commentObject = element;
      return;
    }
  });
  commentObject._id = commentObject._id.toString();
  return commentObject;
};

const postComment = async (postId, userThatPosted, comment) => {
  validateObjectId(postId, "Post ID");
  validateString(comment, "Comment");
  postId = postId.trim();
  comment = comment.trim();

  const newComment = {
    _id: new ObjectId(),
    userThatPosted: userThatPosted.trim(),
    commentDate: moment().format("MM/DD/YYYY, h:mm A"),
    comment: comment,
    commentLikes: [],
    // replies: [],
  };

  const postById = await getPostById(postId);
  if (postById === null) throw notFoundError("Post doesn't exist!");
  const postsCollection = await communityPosts();
  const updatedInfo = await postsCollection.updateOne(
    { _id: new ObjectId(postId) },
    { $push: { postComments: newComment } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw internalServerError("Comment could not be posted!");
  const updatedPost = await getPostById(postId);
  return updatedPost;
};

const deleteComment = async (postId, commentId) => {
  validateObjectId(commentId, "Comment ID");
  commentId = commentId.trim();

  const postExists = await getPostById(postId);
  if (postExists === null) throw notFoundError("Post doesn't exist!");
  const postsCollection = await communityPosts();
  const updatedInfo = await postsCollection.updateOne(
    { _id: new ObjectId(postId) },
    { $pull: { postComments: { _id: new ObjectId(commentId) } } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw internalServerError("Comment could not be deleted!");
  const updatedPost = await getPostById(postId);
  return updatedPost;
};

const editComment = async (postId, commentId, comment) => {
  validateObjectId(commentId, "Comment ID");
  validateObjectId(commentId, "Post ID");
  validateString(comment, "Comment");
  commentId = commentId.trim();
  postId = postId.trim();
  comment = comment.trim();

  const postsCollection = await communityPosts();
  const updatedInfo = await postsCollection.updateOne(
    { _id: new ObjectId(postId), "postComments._id": new ObjectId(commentId) },
    { $set: { "postComments.$.comment": comment } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw internalServerError("Comment could not be edited!");
  const updatedPost = await getPostById(postId);
  return updatedPost;
};

const likeComment = async (userId, postId, commentId) => {
  validateObjectId(postId, "Post ID");
  validateObjectId(userId, "User ID");
  validateObjectId(commentId, "Comment ID");
  postId = postId.trim();
  userId = userId.trim();
  commentId = commentId.trim();

  const postsCollection = await communityPosts();
  const commentExists = await getCommentByCommentId(postId, commentId);
  if (commentExists === null) throw notFoundError("Comment doesn't exist!");
  const updatedInfo = await postsCollection.updateOne(
    { _id: new ObjectId(postId), "postComments._id": new ObjectId(commentId) },
    { $push: { "postComments.$.commentLikes": new ObjectId(userId) } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw internalServerError("Like not updated!");
  const commentLiked = await getCommentByCommentId(postId, commentId);
  commentLiked._id = commentLiked._id.toString();
  return { liked: true, likesLength: commentLiked.commentLikes.length };
};

const unlikeComment = async (userId, postId, commentId) => {
  validateObjectId(postId, "Post ID");
  validateObjectId(userId, "User ID");
  validateObjectId(commentId, "Comment ID");
  postId = postId.trim();
  userId = userId.trim();
  commentId = commentId.trim();

  const postsCollection = await communityPosts();
  const commentExists = await getCommentByCommentId(postId, commentId);
  if (commentExists === null) throw notFoundError("Comment doesn't exist!");
  const updatedInfo = await postsCollection.updateOne(
    { _id: new ObjectId(postId), "postComments._id": new ObjectId(commentId) },
    { $pull: { "postComments.$.commentLikes": new ObjectId(userId) } }
  );
  if (updatedInfo.modifiedCount === 0)
    throw internalServerError("Unlike not updated!");
  const commentLiked = await getCommentByCommentId(postId, commentId);
  commentLiked._id = commentLiked._id.toString();
  return { liked: true, likesLength: commentLiked.commentLikes.length };
};

// const replyToComment = () => {};

// const likeReply = () => {};

// const editReply = () => {};

// const deleteReply = () => {};

export {
  getCommentsByPostId,
  getCommentByCommentId,
  postComment,
  deleteComment,
  editComment,
  likeComment,
  unlikeComment,
  // replyToComment,
  // likeReply,
  // editReply,
  // deleteReply,
};
