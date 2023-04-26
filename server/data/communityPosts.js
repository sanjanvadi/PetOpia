import { ObjectId } from "mongodb";
import { communityPosts } from "../config/mongoCollections.js";
import { badRequestError, internalServerError, notFoundError } from "../helpers/wrappers.js";
import { validateObjectId, validateString } from "../helpers/validations.js";

const getAllPosts = async (page = 1) => {
  const limit = 9;
  if (!Number.isInteger(page)) page = Number(page);
  const postsCollection = await communityPosts();
  if (page < 1) throw badRequestError("Invalid page number!")
  if (page === 1) {
    const allPosts = await postsCollection.find({}).limit(limit).toArray();
    return allPosts;
  } else {
    const allPosts = await postsCollection
      .find({})
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray();
    if (!allPosts.length)
      throw notFoundError("There are no more posts!");
    return allPosts;
  }
};

const getPostById = async (postId) => {
  validateObjectId(postId, "Post ID");
  postId = postId.trim();

  const postsCollection = await communityPosts();
  const postById = await postsCollection.findOne({ _id: new ObjectId(postId) });
  if (postById === null) throw notFoundError("Post doesn't exist!");
  postById._id = postById._id.toString();
  return postById;
};

const createPost = async (
  userThatPosted,
  postImage,
  postTitle,
  postCaption
) => {
  validateObjectId(userThatPosted, "User ID");
  validateString(userThatPosted, "User ID");
  validateString(postImage, "Image path");
  validateString(postCaption, "Post title");
  validateString(postCaption, "Post caption");
  userThatPosted = userThatPosted.trim();
  postImage = postImage.trim();
  postTitle = postTitle.trim();
  postCaption = postCaption.trim();

  const newPost = {
    userThatPosted: userThatPosted, // this userId comes from the active session
    postImage: postImage,
    postTitle: postTitle,
    postCaption: postCaption,
    postComments: [],
    postLikes: [],
  };
  const postsCollection = await communityPosts();
  const insertedInfo = postsCollection.insertOne(newPost);

  if (insertedInfo.insertedCount === 0)
    throw internalServerError("Could not add community post to the database!");
  return newPost;
};

const deletePost = async (postId) => {
  validateObjectId(postId, "Post ID");
  postId = postId.trim();

  const postById = await getPostById(postId);
  if (postById === null) throw notFoundError("Post doesn't exist!");

  const postsCollection = await communityPosts();
  const deleteInfo = await postsCollection.deleteOne({
    _id: new ObjectId(postId),
  });
  if (deleteInfo.deletedCount === 0) {
    throw internalServerError("Post couldn't be delete!");
  }
  return { postId: postId, deleted: true };
};
export { createPost, getAllPosts, getPostById, deletePost };
