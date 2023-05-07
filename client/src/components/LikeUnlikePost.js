import React from "react";
import axios from "axios";
import "../App.css";

const LikeUnlikePost = (props) => {
  const userId = window.sessionStorage.getItem("userid");
  const likeButton = (post) => {
    return post.postLikes.includes(userId) ? (
      <button
        onClick={() => {
          axios
            .delete(`/likes/${post._id}`, {userThatPosted: userId})
            .then(() => {
              props.countFunction();
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        className={props.className}
      >
        <i className="bi bi-hand-thumbs-up-fill"></i>
      </button>
    ) : (
      <button
        onClick={() => {
          axios
            .post(`/likes/${post._id}`, {userThatPosted: userId})
            .then(() => {
              props.countFunction();
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        className={props.className}
      >
        <i className="bi bi-hand-thumbs-up"></i>
      </button>
    );
  };
  return likeButton(props.post);
};

export default LikeUnlikePost;
