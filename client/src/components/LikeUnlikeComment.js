import React from "react";
import axios from "axios";
import "../App.css";
import { useParams } from "react-router-dom";

const LikeUnlikeComment = (props) => {
  const { postId } = useParams();
  const likeButton = (com) => {
    return com.commentLikes.includes("644b1e3a316bde16b1a407f5") ? (
      <button
        onClick={() => {
          axios
            .delete(`/view-post/${postId}/${com._id}`)
            .then(() => {
              props.countFunction();
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
            .post(`/view-post/${postId}/${com._id}`)
            .then(() => {
              props.countFunction();
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
