import { ObjectId } from "mongodb";
import { communityPosts } from "../config/mongoCollections.js";
import {
  internalServerError,
  notFoundError,
} from "../helpers/wrappers.js";
import { validateObjectId, validateString } from "../helpers/validations.js";

const postsCollection = await communityPosts();
const getAllPosts = async () => {
  const allPosts = postsCollection.find({}).toArray();
  return allPosts;
};

const getPostById = async (postId) => {
  validateObjectId(postId, "Post ID");
  postId = postId.trim();
  const postById = await postsCollection.findOne({ _id: new ObjectId(postId) });
  if (postById === null) throw notFoundError("Post doesn't exist!");
  postById._id = postById._id.toString();
  return postById;
};

const createPost = async (userThatPosted, postImage, postDescription) => {
  validateObjectId(userThatPosted, "User ID");
  validateString(userThatPosted, "User ID");
  validateString(postImage, "Image path");
  validateString(postDescription, "Post description");
  userThatPosted = userThatPosted.trim();
  postImage = postImage.trim();
  postDescription = postDescription.trim();

  const newPost = {
    userThatPosted: userThatPosted, // this userId comes from the active session
    postImage: postImage,
    postDescription: postDescription,
    postComments: [],
    postLikes: [],
  };
  const insertedInfo = postsCollection.insertOne(newPost);

  if (insertedInfo.insertedCount === 0)
    throw internalServerError("Could not add community post to the database!");
  return newPost;
};

const deletePost = async (postId) => {
  validateObjectId(postId, "Post ID")
  postId = postId.trim();
  
  const postById = await getPostById(postId);
  if (postById === null) throw notFoundError("Post doesn't exist!");

  const deleteInfo = await postsCollection.deleteOne({
    _id: new ObjectId(postId),
  });
  if (deleteInfo.deletedCount === 0) {
    throw internalServerError("Post couldn't be delete!");
  }
  return { postId: postId, deleted: true };
};
export { createPost, getAllPosts, getPostById, deletePost };
