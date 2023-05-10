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
import redis from "redis";
const client = redis.createClient();
client.connect().then(() => {});

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
  postById.postComments.forEach((ele) => {
    ele._id = ele._id.toString();
  });
  // postById.postComments.sort().reverse();
  postById.postComments.sort((a, b) => {
    return b.commentLikes.length - a.commentLikes.length;
  });
  postById._id = postById._id.toString();
  await client.hSet("posts", postId.toString(), JSON.stringify(postById));
  return postById;
};

const newPost = async (
  userThatPosted,
  userEmail,
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

  const date = new Date(Date.now());


  const addPost = {
    userThatPosted: userThatPosted,
    userEmail: userEmail,
    postImage: postImage,
    postTitle: postTitle,
    postDescription: postDescription,
    postDate: date.toLocaleDateString('en-US', {dateStyle: "long"}),
    postTime: date.toLocaleTimeString('en-US', {timeStyle: "short"}),
    postComments: [],
    postLikes: [],
  };
  const postsCollection = await communityPosts();
  const insertedInfo = postsCollection.insertOne(addPost);

  if (insertedInfo.insertedCount === 0)
    throw internalServerError("Could not add community post to the database!");
  await client.hSet("posts", addPost._id.toString(), JSON.stringify(addPost));
  return addPost;
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
  const oldData = await getPostById(postId);
  for (const comment of oldData.postComments) {
    comment._id = new ObjectId(comment._id);
  }
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
  // const editedPost = await getPostById(postId);
  // await client.hDel("posts", postId.toString());
  // await client.hSet("posts", postId.toString(), JSON.stringify(editedPost));
  return await getPostById(postId);
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
  await client.hDel("posts", postId.toString());
  return { postId: postId, deleted: true };
};

const searchPosts = async (keyword) => {
  const postsCollection = await communityPosts();
  const allPostsData = await postsCollection
    .find()
    .sort({ $natural: -1 })
    .toArray();
  const searchedPosts = allPostsData.filter(
    (post) =>
      post.postTitle.toLowerCase().includes(keyword) ||
      post.postDescription.toLowerCase().includes(keyword)
  );
  return searchedPosts;
};

export { newPost, getAllPosts, getPostById, deletePost, editPost, searchPosts };
