import { ObjectId } from "mongodb";
import { communityPosts } from "../config/mongoCollections.js";
import {
  badRequestError,
  internalServerError,
  notFoundError,
} from "../helpers/wrappers.js";
import {
  validateObjectId,
  validatePostTitle,
  validateString,
} from "../helpers/validations.js";
import moment from "moment";

const getAllPosts = async (page = 1) => {
  const limit = 4;
  if (!Number.isInteger(page)) page = Number(page);
  const postsCollection = await communityPosts();
  const allPostsData = await postsCollection
    .find()
    .sort({ $natural: -1 })
    .toArray();
  const numberOfDocs = await postsCollection.countDocuments();
  if (page < 1) throw badRequestError("Invalid page number in URL!");
  if (page === 1) {
    const allPosts = await postsCollection
      .find({})
      .sort({ $natural: -1 })
      .limit(limit)
      .toArray();
    return {
      allPosts: allPosts,
      allPostsData: allPostsData,
      numberOfDocs: numberOfDocs,
      limit: limit,
    };
  } else {
    const allPosts = await postsCollection
      .find({})
      .sort({ $natural: -1 })
      .skip(limit * (page - 1))
      .limit(limit)
      .toArray();
    if (!allPosts.length) throw notFoundError("There are no more posts!");
    return {
      allPosts: allPosts,
      allPostsData: allPostsData,
      numberOfDocs: numberOfDocs,
      limit: limit,
    };
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

const newPost = async (
  userThatPosted,
  postImage,
  postTitle,
  postDescription
) => {
  validateObjectId(userThatPosted, "User ID");
  validateString(userThatPosted, "User ID");
  if (postImage !== "") {
    validateString(postImage, "Image path");
    postImage = postImage.trim();
  }
  validateString(postTitle, "Post title");
  validatePostTitle(postTitle, "Post title");
  validateString(postDescription, "Post description");
  postTitle = postTitle.trim();
  postDescription = postDescription.trim();
  userThatPosted = userThatPosted.trim();

  const addPost = {
    userThatPosted: userThatPosted, // this userId comes from the active session
    postImage: postImage,
    postTitle: postTitle,
    postDescription: postDescription,
    postDate: moment().format("MMMM Do YYYY"),
    postTime: moment().format("h:mm A"),
    postComments: [],
    postLikes: [],
  };
  const postsCollection = await communityPosts();
  const insertedInfo = postsCollection.insertOne(addPost);

  if (insertedInfo.insertedCount === 0)
    throw internalServerError("Could not add community post to the database!");
  return newPost;
};

const editPost = async (
  postId,
  userThatPosted,
  postImage,
  postTitle,
  postDescription
) => {
  validateObjectId(userThatPosted, "User ID");
  validateString(userThatPosted, "User ID");
  validateString(postTitle, "Post title");
  validatePostTitle(postTitle, "Post title");
  validateString(postDescription, "Post description");
  postTitle = postTitle.trim();
  postDescription = postDescription.trim();
  userThatPosted = userThatPosted.trim();

  let updatedPost;

  // if (postImage !== "") {
  //   validateString(postImage, "Image path");
  //   postImage = postImage.trim();
  //   updatedPost = {
  //     userThatPosted: userThatPosted, // this userId comes from the active session
  //     postImage: postImage,
  //     postTitle: postTitle,
  //     postDescription: postDescription,
  //   };
  // } else {
  //   updatedPost = {
  //     userThatPosted: userThatPosted, // this userId comes from the active session
  //     postTitle: postTitle,
  //     postDescription: postDescription,
  //   };
  // }

  const oldData = await getPostById(postId);
  if (postImage !== "") {
    validateString(postImage, "Image path");
    postImage = postImage.trim();
    updatedPost = {
      userThatPosted: oldData.userThatPosted,
      postImage: postImage,
      postTitle: postTitle,
      postDescription: postDescription,
      dateString: oldData.dateString,
      postDate: oldData.postDate,
      postTime: oldData.postTime,
      postComments: oldData.postComments,
      postLikes: oldData.postLikes,
    };
  } else {
    updatedPost = {
      userThatPosted: oldData.userThatPosted,
      postImage: postImage,
      postTitle: postTitle,
      postDescription: postDescription,
      dateString: oldData.dateString,
      postDate: oldData.postDate,
      postTime: oldData.postTime,
      postComments: oldData.postComments,
      postLikes: oldData.postLikes,
    };
  }

  const postsCollection = await communityPosts();
  const updateInfo = await postsCollection.updateOne(
    { _id: new ObjectId(postId) },
    { $set: updatedPost }
  );
  if (updateInfo.modifiedCount === 0)
    throw internalServerError("You haven't made any changes!");
  const editedPost = await getPostById(postId);
  return editedPost;
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
export { newPost, getAllPosts, getPostById, deletePost, editPost };
