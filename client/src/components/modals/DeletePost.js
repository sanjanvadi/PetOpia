import React, { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import { useNavigate } from "react-router-dom";

function DeletePost(props) {
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [axiosLoading, setAxiosLoading] = useState(null);
  // const [formSubmitted, setFormSubmitted] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);
  let navigate = useNavigate();

  const handleCloseModal = () => {
    setIsOpen(false);
    props.handleChange();
    props.handlePostDeleteModalClose();
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setAxiosLoading(true);
    axios
      .delete(`/community-posts/${props.postId}`)
      .then(() => {
        setAxiosLoading(false);
        // setFormSubmitted(true);
        // setShowAlert(true);
        navigate(`/account/community-posts`);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {/* {formSubmitted && showAlert && (
        <div className="alert alert-success fade show" role="alert">
          Post successfully deleted!
        </div>
      )} */}
      <Modal
        className="modal-lg modal-content"
        isOpen={isOpen}
        contentLabel="Form Modal"
      >
        {isOpen && (
          <div>
            <span style={{ fontSize: "1.6em" }}>
              Are you sure you want to delete this post?
            </span>{" "}
            <br />
            <form onSubmit={handleSubmit}>
              <div className="mb-3"></div>

              {axiosLoading ? <p>Deleting...</p> : <span></span>}
              <button
                style={{ float: "left" }}
                id="post-upload"
                className="post-link"
                type="submit"
              >
                Yes
              </button>
              <button
                style={{ float: "right" }}
                onClick={handleCloseModal}
                id="post-upload"
                className="post-link"
              >
                No
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default DeletePost;
