import React from "react";
import axios from "axios";
import "../App.css";
import { useParams } from "react-router-dom";

const LikeUnlikeComment = (props) => {
  const userId = window.sessionStorage.getItem("userid");
  const { postId } = useParams();
  
  const likeButton = (com) => {
    return com.commentLikes.includes(userId) ? (
      <button
        onClick={() => {
          axios
            .delete(`/view-post/${postId}/${com._id}/${userId}`)
            .then(() => {
              props.countFunction()
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        className="like-button"
      >
        <i className="bi bi-hand-thumbs-up-fill"></i>
      </button>
    ) : (
      <button
        onClick={() => {
          axios
            .post(`/view-post/${postId}/${com._id}`, { userThatPosted: userId })
            .then(() => {
              props.countFunction()
            })
            .catch((error) => {
              console.log(error);
            });
        }}
        className="like-button"
      >
        <i className="bi bi-hand-thumbs-up"></i>
      </button>
    );
  };
  return likeButton(props.commentObj);
};

export default LikeUnlikeComment;
