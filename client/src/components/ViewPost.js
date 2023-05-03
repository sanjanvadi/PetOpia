import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
  Typography,
} from "@mui/material";
import { Divider, Grid, Paper } from "@material-ui/core";
import "../App.css";
import EditPost from "./modals/EditPost";
import DeletePost from "./modals/DeletePost";
import NewPost from "./modals/NewPost";
import LikeUnlikePost from "./LikeUnlikePost";
import LikeUnlikeComment from "./LikeUnlikeComment";

function ViewPost() {
  const [viewPost, setViewPost] = useState(undefined);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState(0);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [comments, setComments] = useState(undefined);
  const [newComment, setNewComment] = useState(undefined);
  let { postId } = useParams();
  let navigate = useNavigate();
  let comment;

  useEffect(() => {
    const getPostsAndComments = async () => {
      try {
        const resPosts = await axios.get(`/community-posts/${postId}`);
        const resComments = await axios.get(`/view-post/${postId}`);
        setViewPost(resPosts.data);
        setComments(resComments.data.postComments);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getPostsAndComments();
  }, [postId, count]);

  const handleChange = () => {
    setCount(count + 1);
  };

  const handleEditModalOpen = () => {
    setEditModalOpen(true);
  };

  const handleEditModalClose = () => {
    setEditModalOpen(false);
  };

  const handleDeleteModalOpen = () => {
    setDeleteModalOpen(true);
  };

  const handleDeleteModalClose = () => {
    setDeleteModalOpen(false);
  };

  const handleNewModalOpen = () => {
    setNewModalOpen(true);
  };

  const handleNewModalClose = () => {
    setNewModalOpen(false);
  };

  const handleNavigate = () => {
    navigate(-1);
  };

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCommentAdded = async (event) => {
    event.preventDefault();
    axios
      .post(`/view-post/${postId}`, {
        comment: newComment,
      })
      .then(() => {
        setNewComment("");
      })
      .catch((error) => {
        console.log(error);
      });
    setCount(count + 1);
  };

  const buildCard = () => {
    const res = viewPost.postImage ? (
      <div className="post-and-comment">
        <div className="view-post">
          <Card
            className="views"
            variant="outlined"
            sx={{
              maxWidth: 550,
              height: "auto",
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 5,
              border: "1px solid",
              boxShadow:
                "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
            }}
          >
            <CardHeader
              title={viewPost.postTitle}
              sx={{
                borderBottom: "1px solid #1e8678",
                fontWeight: "bold",
              }}
            />
            <CardMedia
              component="img"
              image={viewPost.postImage}
              title={viewPost.postTitle}
            />

            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                sx={{
                  borderBottom: "1px solid",
                  fontWeight: "bold",
                }}
              >
                <dl>
                  <p>
                    <dt className="title">Posted By: </dt>
                    {viewPost && " " + viewPost.userThatPosted}
                  </p>
                  <p>
                    <dt className="title">Posted On: </dt>
                    {viewPost &&
                      " " + viewPost.postDate + " at " + viewPost.postTime}
                  </p>
                  <p>
                    <dt className="title">Description: </dt>
                    {viewPost && " " + viewPost.postDescription}
                  </p>
                  <p>
                    Found it useful?
                    <LikeUnlikePost
                      className={"like-button"}
                      countFunction={handleChange}
                      post={viewPost}
                    />
                    {viewPost.postLikes.length !== 0 &&
                      (viewPost.postLikes.length === 1
                        ? viewPost.postLikes.length + " like"
                        : viewPost.postLikes.length + " likes")}
                  </p>
                  {viewPost.userThatPosted === "644f4dd3258aac3913f46b73" && (
                    <button onClick={handleEditModalOpen} className="post-link">
                      Edit
                    </button>
                  )}
                  {viewPost.userThatPosted === "644f4dd3258aac3913f46b73" && (
                    <button
                      onClick={handleDeleteModalOpen}
                      className="post-link"
                    >
                      Delete
                    </button>
                  )}
                  {editModalOpen && (
                    <EditPost
                      handleEditModalClose={handleEditModalClose}
                      isOpen={editModalOpen}
                      handleChange={handleChange}
                      oldDetails={{
                        postId: postId,
                        postImage: viewPost.postImage,
                        postTitle: viewPost.postTitle,
                        postDescription: viewPost.postDescription,
                      }}
                    />
                  )}
                  {deleteModalOpen && (
                    <DeletePost
                      handleDeleteModalClose={handleDeleteModalClose}
                      isOpen={deleteModalOpen}
                      handleChange={handleChange}
                      postId={postId}
                    />
                  )}
                </dl>
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div style={{ padding: 14 }} className="comment-section">
          <h2>Comment Section</h2>
          <form onSubmit={handleCommentAdded}>
            <div className="write-comment">
              <label htmlFor="comment-box"></label>
              <input
                value={newComment}
                onChange={handleCommentChange}
                id="comment-box"
                placeholder="Write a comment..."
                type="text"
                required
              />
              <button type="submit" className="post-link">
                Post
              </button>
            </div>
          </form>
          <Paper style={{ padding: "30px 20px" }}>
            {comment.length ? comment : "No Comments Posted!"}
          </Paper>
        </div>
      </div>
    ) : (
      <div className="post-and-comment">
        <div className="view-post">
          <Card
            className="views"
            variant="outlined"
            sx={{
              maxWidth: 550,
              height: "auto",
              marginLeft: "auto",
              marginRight: "auto",
              borderRadius: 5,
              border: "1px solid",
              boxShadow:
                "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
            }}
          >
            <CardHeader
              title={viewPost.postTitle}
              sx={{
                borderBottom: "1px solid #1e8678",
                fontWeight: "bold",
              }}
            />
            <CardContent>
              <Typography
                variant="body2"
                color="textSecondary"
                component="span"
                sx={{
                  borderBottom: "1px solid",
                  fontWeight: "bold",
                }}
              >
                <dl>
                  <p>
                    <dt className="title">Posted On: </dt>
                    {viewPost && viewPost.userThatPosted}
                  </p>
                  <p>
                    <dt className="title">Posted On: </dt>
                    {viewPost &&
                      " " + viewPost.postDate + " at " + viewPost.postTime}
                  </p>
                  <p>
                    <dt className="title">Description: </dt>
                    {viewPost && " " + viewPost.postDescription}
                  </p>
                  <br />
                  <p>
                    Found it useful?
                    <LikeUnlikePost
                      className={"like-button"}
                      countFunction={handleChange}
                      post={viewPost}
                    />
                    {viewPost.postLikes.length !== 0 &&
                      (viewPost.postLikes.length === 1
                        ? viewPost.postLikes.length + " like"
                        : viewPost.postLikes.length + " likes")}
                  </p>
                  <button onClick={handleEditModalOpen} className="post-link">
                    Edit
                  </button>
                  <button onClick={handleDeleteModalOpen} className="post-link">
                    Delete
                  </button>
                  {editModalOpen && (
                    <EditPost
                      handleEditModalClose={handleEditModalClose}
                      isOpen={editModalOpen}
                      handleChange={handleChange}
                      oldDetails={{
                        postId: postId,
                        postTitle: viewPost.postTitle,
                        postDescription: viewPost.postDescription,
                      }}
                    />
                  )}
                  {deleteModalOpen && (
                    <DeletePost
                      handleDeleteModalClose={handleDeleteModalClose}
                      isOpen={deleteModalOpen}
                      handleChange={handleChange}
                      postId={postId}
                    />
                  )}
                </dl>
              </Typography>
            </CardContent>
          </Card>
        </div>
        <div style={{ padding: 14 }} className="comment-section">
          <h2>Comment Section</h2>
          <form onSubmit={handleCommentAdded}>
            <div className="write-comment">
              <label htmlFor="comment-box"></label>
              <input
                value={newComment}
                onChange={handleCommentChange}
                id="comment-box"
                placeholder="Write a comment..."
                type="text"
                required
              />
              <button type="submit" className="post-link">
                Post
              </button>
            </div>
          </form>
          <Paper style={{ padding: "40px 20px" }}>
            {comment.length ? comment : "No Comments Posted!"}
          </Paper>
        </div>
      </div>
    );
    return res;
  };

  const buildComment = (com) => {
    // make an axios call here to get the user details
    return (
      <>
        <Grid container wrap="nowrap" spacing={2}>
          <Grid justifyContent="left" item xs zeroMinWidth>
            <p style={{ margin: 0, textAlign: "left", fontWeight: "bold" }}>
              {com.userThatPosted}
              <LikeUnlikeComment
                countFunction={handleChange}
                commentObj={com}
              />
              <span style={{ fontWeight: "lighter" }}>
                {com.commentLikes.length !== 0 &&
                  (com.commentLikes.length === 1
                    ? com.commentLikes.length + " like"
                    : com.commentLikes.length + " likes")}
              </span>
            </p>
            <p style={{ textAlign: "left" }}>{com.comment}</p>
            <p style={{ textAlign: "left", color: "gray" }}>
              Posted On: {com.commentDate + ", " + com.commentTime}
            </p>
          </Grid>
        </Grid>
        <Divider variant="fullWidth" style={{ margin: "30px 0" }} />
      </>
    );
  };

  comment =
    comments &&
    comments.map((com) => {
      return buildComment(com);
    });

  if (loading)
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  else
    return (
      <div>
        <button onClick={handleNewModalOpen} className="post-link my-posts">
          New Post
        </button>
        <button onClick={handleNavigate} className="post-link my-posts">
          Back to All Posts
        </button>
        {buildCard()}
        {newModalOpen && (
          <NewPost
            handleNewModalClose={handleNewModalClose}
            isOpen={newModalOpen}
            handleChange={handleChange}
          />
        )}
      </div>
    );
}

export default ViewPost;
