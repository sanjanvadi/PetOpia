import { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import ErrorHandler from "../ErrorHandler";
const cloudinaryApi = "dzlf4ut72";
const presetValue = "lqbvmbqp";

Modal.setAppElement("#root");

function EditPost(props) {
  const userId = window.sessionStorage.getItem("userid");
  const [postImage, setPostImage] = useState("");
  const [postTitle, setPostTitle] = useState(props.oldDetails.postTitle);
  const [postDescription, setPostDescription] = useState(
    props.oldDetails.postDescription
  );
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [axiosLoading, setAxiosLoading] = useState(null);
  const [checked, setChecked] = useState(false);
  const [isError, setIsError] = useState(false);
  const [serverError, setServerError] = useState(false);
  const [displayedError, setDisplayedError] = useState(null);
  const [isDescError, setIsDescError] = useState(null);
  const [displayedErrorForTitle, setDisplayedErrorForTitle] = useState(null);
  const [displayedErrorFordesc, setDisplayedErrorForDesc] = useState(null);
  // const [formSubmitted, setFormSubmitted] = useState(false);
  // const [showAlert, setShowAlert] = useState(false);

  const handleCheckBox = () => {
    setChecked(!checked);
  };

  const handleImageChange = (event) => {
    if (event.target.files[0] && props.oldDetails.postImage) {
      setPostImage(event.target.files[0]);
      document.getElementById("remove-pic").checked = false;
      document.getElementById("remove-pic").disabled = true;
    } else if (event.target.files[0]) {
      setPostImage(event.target.files[0]);
    } else if (!event.target.files[0]) {
      document.getElementById("remove-pic").disabled = false;
    } else if (checked) setPostImage("");
  };

  const handleTitleChange = (event) => {
    if (postImage) {
      if (!event.target.value.trim().length) {
        setIsError(true);
        setDisplayedErrorForTitle("Title can't be empty!");
        document.querySelector("#post-upload").hidden = true;
      } else if (event.target.value.length > 30) {
        setIsError(true);
        setDisplayedErrorForTitle("Post title cannot contain more than 30 characters!");
        document.querySelector("#post-upload").hidden = true;
        document.querySelector("#remove-pic").hidden = true;
        document.querySelector("#remove-pic-label").hidden = true;
      } else {
        setIsError(false);
        setDisplayedErrorForTitle(null);
        document.querySelector("#post-upload").hidden = false;
        document.querySelector("#remove-pic").hidden = false;
        document.querySelector("#remove-pic-label").hidden = false;
      }
      setPostTitle(event.target.value);
    } else {
      if (!event.target.value.trim().length) {
        setIsError(true);
        setDisplayedErrorForTitle("Title can't be empty!");
        document.querySelector("#post-upload").hidden = true;
      } else if (event.target.value.length > 30) {
        setIsError(true);
        setDisplayedErrorForTitle("Post title cannot contain more than 30 characters!");
        document.querySelector("#post-upload").hidden = true;
      } else {
        setIsError(false);
        setDisplayedErrorForTitle(null);
        document.querySelector("#post-upload").hidden = false;
      }
      setPostTitle(event.target.value);
    }
  };

  const handleDescriptionChange = (event) => {
    if (!event.target.value.trim().length) {
      setIsDescError(true);
      setDisplayedErrorForDesc("Description can't be empty!");
      document.querySelector("#post-upload").hidden = true;
    } else {
      setIsDescError(false);
      setDisplayedErrorForDesc(null);
      document.querySelector("#post-upload").hidden = false;
    }
    setPostDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsError(false);
    setIsDescError(false);
    setAxiosLoading(true);
    document.querySelector("#post-upload").disabled = true;
    if (postImage) {
      const formData = new FormData();
      formData.append("file", postImage);
      formData.append("upload_preset", presetValue);

      axios
        .post(
          `https://api.cloudinary.com/v1_1/${cloudinaryApi}/image/upload`,
          formData
        )
        .then((response) => {
          setPostImage(response.data.url);

          axios
            .put(`/community-posts/${props.oldDetails.postId}`, {
              userThatPosted: userId,
              postImage: response.data.url,
              postTitle: postTitle,
              postDescription: postDescription,
            })
            .then(() => {
              setAxiosLoading(false);
              setServerError(false);
              setPostImage("");
              setPostTitle("");
              setPostDescription("");
              handleCloseModal();
              setChecked(false);
              // setFormSubmitted(true);
              // setShowAlert(true);
              document.querySelector("#post-upload").disabled = false;
            })
            .catch((error) => {
              setAxiosLoading(false);
              setServerError(true);
              setDisplayedError(error.response.data);
            });
        })
        .catch((error) => console.log(error));
    } else {
      axios
        .put(`/community-posts/${props.oldDetails.postId}`, {
          userThatPosted: userId,
          postImage: checked ? "" : props.oldDetails.postImage,
          postTitle: postTitle,
          postDescription: postDescription,
        })
        .then(() => {
          setAxiosLoading(false);
          setServerError(false);
          setPostImage("");
          setPostTitle("");
          setPostDescription("");
          handleCloseModal();
          setChecked(false);
          // setFormSubmitted(true);
          // setShowAlert(true);
          document.querySelector("#post-upload").disabled = false;
        })
        .catch((error) => {
          setAxiosLoading(false);
          setServerError(true);
          setDisplayedError(error.response.data);
          document.querySelector("#post-upload").disabled = false;
        });
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    props.handleChange();
    props.handleEditModalClose();
  };

  return (
    <div>
      {/* {formSubmitted && showAlert && (
        <div className="alert alert-success fade show" role="alert">
          Post successfully edited!
        </div>
      )} */}
      <Modal
        className="modal-lg modal-content"
        isOpen={isOpen}
        contentLabel="Form Modal"
      >
        {isOpen && (
          <div>
            <h1>Edit Post</h1> <br />
            <br />
            <button
              id="close-button"
              className="post-link"
              onClick={handleCloseModal}
            >
              &times;
            </button>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="post-image" className="form-label">
                  Change Picture
                </label>
                <input
                  id="post-image"
                  className="form-control"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              <br />
              <label htmlFor="post-title" className="form-label">
                Change Title
              </label>
              <input
                id="post-title"
                placeholder="Headline of your post..."
                className="form-control"
                type="text"
                value={postTitle}
                onChange={handleTitleChange}
                required
              />
              <br />
              {isError && <ErrorHandler error={displayedErrorForTitle} />}
              <label htmlFor="post-description" className="form-label">
                Change Description
              </label>
              <textarea
                id="post-description"
                placeholder="Describe what your post is about..."
                rows={4}
                className="form-control"
                type="text"
                value={postDescription}
                onChange={handleDescriptionChange}
                required
              />
              <br />
              {axiosLoading && <p>Updating...</p>}
              {isDescError && <ErrorHandler error={displayedErrorFordesc} />}
              {serverError && <ErrorHandler error={displayedError} />}
              {props.oldDetails.postImage ? (
                <>
                  {" "}
                  <button
                    id="post-upload"
                    className="post-link edit-post-submit"
                    type="submit"
                  >
                    Submit
                  </button>
                  <label
                    id="remove-pic-label"
                    className="remove-picture-label"
                    htmlFor="remove-pic"
                  >
                    Remove Picture
                  </label>
                  <input
                    onChange={handleCheckBox}
                    className="remove-picture"
                    id="remove-pic"
                    type="checkbox"
                  />
                </>
              ) : (
                <>
                  <button id="post-upload" className="post-link" type="submit">
                    Submit
                  </button>
                </>
              )}
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default EditPost;
