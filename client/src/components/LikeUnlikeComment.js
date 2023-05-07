import React, { useState } from "react";
import axios from "axios";
import "../App.css";
import { useParams } from "react-router-dom";

const LikeUnlikeComment = (props) => {
  const userId = window.sessionStorage.getItem("userid");
  const { postId } = useParams();
  const [com,setCom] = useState(props.commentObj);
  
  const handleLikeUnlike=()=>{
    props.countFunction()
  }
  const likeButton = () => {
    // console.log(com.commentLikes);
    console.log(com);
    return com.commentLikes.includes(userId) ? (
      <button
        onClick={() => {
          // console.log("unliked");
          axios
            .delete(`/view-post/${postId}/${com._id}/${userId}`)
            .then(() => {
              // console.log("deleted like");
              handleLikeUnlike()
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
          // console.log("liked");
          axios
            .post(`/view-post/${postId}/${com._id}`, { userThatPosted: userId })
            .then(() => {
              // console.log("added like");
              handleLikeUnlike()
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
  return likeButton();
};

export default LikeUnlikeComment;
