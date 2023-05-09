import { useState } from "react";
import axios from "axios";
import Modal from "react-modal";
import ErrorHandler from "../ErrorHandler";
const cloudinaryApi = "dzlf4ut72";
const presetValue = "lqbvmbqp";

Modal.setAppElement("#root");

function NewPost(props) {
  const userId = window.sessionStorage.getItem("userid");
  let userEmail = window.sessionStorage.getItem("userEmail");
  userEmail = userEmail.substring(0, userEmail.indexOf("@"));
  const [postImage, setPostImage] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postDescription, setPostDescription] = useState("");
  const [isOpen, setIsOpen] = useState(props.isOpen);
  const [axiosLoading, setAxiosLoading] = useState(null);
  const [isError, setIsError] = useState(null);
  const [isDescError, setIsDescError] = useState(null);
  const [displayedErrorForTitle, setDisplayedErrorForTitle] = useState(null);
  const [displayedErrorFordesc, setDisplayedErrorForDesc] = useState(null);

  const handleImageChange = (event) => {
    setPostImage(event.target.files[0]);
  };

  const handleTitleChange = (event) => {
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
  };

  const handleDescriptionChange = (event) => {
    if (!event.target.value.trim().length) {
      setIsDescError(true);
      setDisplayedErrorForDesc("Description can't be empty!");
      document.querySelector("#post-upload").hidden = true;
    } else {
      setIsError(false);
      setDisplayedErrorForDesc(null);
      document.querySelector("#post-upload").hidden = false;
    }
    setPostDescription(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setAxiosLoading(true);
    setIsError(false);
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
            .post("/community-posts/", {
              userThatPosted: userId,
              userEmail: userEmail,
              postImage: response.data.url,
              postTitle: postTitle,
              postDescription: postDescription,
            })
            .then(() => {
              setPostImage(null);
              setPostTitle("");
              setPostDescription("");
              handleCloseModal();
              setAxiosLoading(false);
              // setFormSubmitted(true);
              // setShowAlert(true);
              document.querySelector("#post-upload").disabled = false;
            })
            .catch((error) => {
              console.log(error);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    } else {
      axios
        .post("/community-posts/", {
          userThatPosted: userId,
          userEmail: userEmail,
          postImage: null,
          postTitle: postTitle,
          postDescription: postDescription,
        })
        .then(() => {
          setPostImage(null);
          setPostTitle("");
          setPostDescription("");
          handleCloseModal();
          setAxiosLoading(false);
          // setFormSubmitted(true);
          // setShowAlert(true);
          document.querySelector("#post-upload").disabled = false;
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    props.handleChange();
    props.handleNewModalClose();
  };

  return (
    <div>
      {/* {formSubmitted && showAlert && (
        <div className="alert alert-success fade show" role="alert">
          Post successfully uploaded!
        </div>
      )} */}
      <Modal
        className="modal-lg modal-content"
        isOpen={isOpen}
        contentLabel="Form Modal"
      >
        {isOpen && (
          <div>
            <h1>New Post</h1> <br />
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
                  Upload a Picture
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
                Post Title
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
                Write a Description
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
              {axiosLoading && <p>Uploading...</p>}
              {isDescError && <ErrorHandler error={displayedErrorFordesc} />}
              <button id="post-upload" className="post-link" type="submit">
                Submit
              </button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
}

export default NewPost;
