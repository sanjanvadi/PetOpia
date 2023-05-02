import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import NewPost from "./modals/NewPost";
import LikeUnlikePost from "./LikeUnlikePost";
import { Card, CardContent, CardMedia, Grid, Typography } from "@mui/material";
import "../../src/App.css";
// import SearchPosts from "./SearchPosts.js";

function CommunityPosts() {
  const [firstPage, setFirstPage] = useState(false);
  const [lastPage, setLastPage] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [allPostsData, setAllPostsData] = useState(undefined);
  const [myPostsData, setMyPostsData] = useState(undefined);
  const [newModalOpen, setNewModalOpen] = useState(false);
  const [count, setCount] = useState(0);
  const [postType, setPostType] = useState("allPosts");
  let card = null;
  //   const [searchedData, setSearchedData] = useState(undefined);
  //   const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const getPostsData = async () => {
      try {
        const { data } = await axios.get(
          `/community-posts?page=${currentPage}`
        );
        setMyPostsData(data.allData.allPostsData);
        const numberOfPages = Math.ceil(
          data.allData.numberOfDocs / data.allData.limit
        );
        const remainingPosts = Math.ceil(
          data.allData.numberOfDocs % data.allData.limit
        );
        if (currentPage === 1) setFirstPage(true);
        else setFirstPage(false);
        if (currentPage === numberOfPages) {
          if (remainingPosts <= data.allData.limit) setLastPage(true);
          else setLastPage(false);
        } else setLastPage(false);
        setAllPostsData(data.allData.allPosts);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    getPostsData();
  }, [currentPage, count]);

  const handleNewModalOpen = () => {
    setNewModalOpen(true);
  };

  const handleNewModalClose = () => {
    setNewModalOpen(false);
  };

  const handleChange = () => {
    setCount(count + 1);
  };

  //   useEffect(() => {
  //     async function fetchData() {
  //       try {
  //         console.log(`in fetch searchTerm: ${searchTerm}`);
  //         const { data } = await axios.get(
  //           "http://api.tvmaze.com/search/posts?q=" + searchTerm
  //         );
  //         setSearchedData(data);
  //         setLoading(false);
  //       } catch (e) {
  //         console.log(e);
  //       }
  //     }
  //     if (searchTerm) {
  //       console.log("searchTerm is set");
  //       fetchData();
  //     }
  //   }, [searchTerm]);

  //   const searchValue = async (value) => {
  //     setSearchTerm(value);
  //   };

  const buildCard = (post) => {
    const res = post.postImage ? (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={post._id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <Link to={`/community-posts/${post._id}`}>
            <CardMedia
              sx={{
                height: "100%",
                width: "100%",
              }}
              component="img"
              image={post.postImage}
              title={post.postTitle}
            />
          </Link>

          <CardContent>
            <Typography
              className="card-flex"
              gutterBottom
              variant="h6"
              component="h3"
            >
              <div style={{ fontWeight: "bold" }} className="date">
                {post.userThatPosted.length > 13
                  ? post.userThatPosted.slice(0, 13) + "..."
                  : post.userThatPosted}
                <br />
                <LikeUnlikePost className = {"in-community-posts"} countFunction={handleChange} post={post} />
              </div>
              <div className="date">
                {post.postDate}
                <br />
                {post.postTime}
              </div>
            </Typography>
            <Link to={`/community-posts/${post._id}`}>
              <Typography
                sx={{
                  borderBottom: "1px solid",
                  fontWeight: "bold",
                }}
                gutterBottom
                variant="h6"
                component="h3"
              >
                <div className="post-title">{post.postTitle}</div>
              </Typography>
              <Typography
                className=""
                variant="body2"
                color="textSecondary"
                component="p"
              >
                {post.postDescription.length > 60
                  ? post.postDescription.slice(0, 60) + "..."
                  : post.postDescription}
              </Typography>
            </Link>
          </CardContent>
        </Card>
      </Grid>
    ) : (
      <Grid item xs={12} sm={7} md={5} lg={4} xl={3} key={post._id}>
        <Card
          variant="outlined"
          sx={{
            maxWidth: 250,
            height: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            borderRadius: 5,
            border: "1px solid",
            boxShadow:
              "0 19px 38px rgba(0,0,0,0.30), 0 15px 12px rgba(0,0,0,0.22);",
          }}
        >
          <CardContent>
            <Typography
              className="card-flex"
              gutterBottom
              variant="h6"
              component="h3"
            >
              <div className="date">
                {post.postDate}
                <br />
                {post.postTime}
              </div>
              <div style={{ fontWeight: "bold" }} className="date">
                {post.userThatPosted.slice(0, 5)}
                <br />
                <LikeUnlikePost className = {"in-community-posts"} countFunction={handleChange} post={post} />
              </div>
            </Typography>
            <Link to={`/community-posts/${post._id}`}>
              <Typography
                sx={{
                  borderBottom: "1px solid",
                  fontWeight: "bold",
                }}
                gutterBottom
                variant="h6"
                component="h3"
              >
                <div className="post-title">{post.postTitle}</div>
              </Typography>
              <Typography variant="body2" color="textSecondary" component="p">
                {post.postDescription && post.postDescription}
              </Typography>
            </Link>
          </CardContent>
        </Card>
      </Grid>
    );
    return res;
  };

  //   if (searchTerm) {
  //     card =
  //       searchedData &&
  //       searchedData.map((posts) => {
  //         let { post } = posts;
  //         return buildCard(post);
  //       });
  //   } else {
  // card =
  //   allPostsData &&
  //   allPostsData.map((post) => {
  //     return buildCard(post);
  //   });
  //   }

  const next = () => {
    setCurrentPage(currentPage + 1);
  };

  const prev = () => {
    setCurrentPage(currentPage - 1);
  };

  const handleDropdown = (event) => {
    if (event.target.value === "option1") {
      setPostType("allPosts");
    } else if (event.target.value === "option2") {
      setPostType("myPosts");
    }
  };

  if (postType === "allPosts") {
    card = allPostsData && allPostsData.map((post) => buildCard(post));
  } else if (postType === "myPosts") {
    card = myPostsData && myPostsData.map((post) => buildCard(post));
  }

  if (loading) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (firstPage && lastPage) {
    return (
      <div>
        <div className="post-link community">PetOpia Community</div>
        {/* <SearchPosts searchValue={searchValue} /> */}
        <button className="post-link new-post">
          <select onChange={handleDropdown} className="dropdown">
            <option value="option1">All Posts</option>
            <option value="option2">My Posts</option>
          </select>
        </button>
        <button
          onClick={() => handleNewModalOpen()}
          className="post-link new-post"
        >
          New Post
        </button>
        {newModalOpen && (
          <NewPost
            handleNewModalClose={handleNewModalClose}
            isOpen={newModalOpen}
            handleChange={handleChange}
          />
        )}
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  } else if (firstPage) {
    return (
      <div>
        <div className="post-link community">PetOpia Community</div>
        {/* <SearchPosts searchValue={searchValue} /> */}
        <button className="post-link new-post">
          <select onChange={handleDropdown} className="dropdown">
            <option value="option1">All Posts</option>
            <option value="option2">My Posts</option>
          </select>
        </button>
        <button
          onClick={() => handleNewModalOpen()}
          className="post-link new-post"
        >
          New Post
        </button>
        <br />
        {postType === "allPosts" && (
          <button onClick={next} className="post-link">
            Next
          </button>
        )}
        {newModalOpen && newModalOpen && (
          <NewPost
            handleNewModalClose={handleNewModalClose}
            isOpen={newModalOpen}
            handleChange={handleChange}
          />
        )}
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  } else if (lastPage) {
    return (
      <div>
        <div className="post-link community">PetOpia Community</div>
        {/* <SearchPosts searchValue={searchValue} /> */}
        <button className="post-link new-post">
          <select onChange={handleDropdown} className="dropdown">
            <option value="option1">All Posts</option>
            <option value="option2">My Posts</option>
          </select>
        </button>
        <button
          onClick={() => handleNewModalOpen()}
          className="post-link new-post"
        >
          New Post
        </button>
        <br />
        {postType === "allPosts" && (
          <button onClick={prev} className="post-link">
            Prev
          </button>
        )}
        {newModalOpen && newModalOpen && (
          <NewPost
            handleNewModalClose={handleNewModalClose}
            isOpen={newModalOpen}
            handleChange={handleChange}
          />
        )}
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  } else {
    return (
      <div>
        <div className="post-link community">PetOpia Community</div>
        {/* <SearchPosts searchValue={searchValue} /> */}
        <button className="post-link new-post">
          <select onChange={handleDropdown} className="dropdown">
            <option value="option1">All Posts</option>
            <option value="option2">My Posts</option>
          </select>
        </button>
        <button
          onClick={() => handleNewModalOpen()}
          className="post-link new-post"
        >
          New Post
        </button>
        <br />
        {postType === "allPosts" && (
          <button onClick={prev} className="post-link">
            Prev
          </button>
        )}

        {postType === "allPosts" && (
          <button onClick={next} className="post-link">
            Next
          </button>
        )}
        {newModalOpen && newModalOpen && (
          <NewPost
            handleNewModalClose={handleNewModalClose}
            isOpen={newModalOpen}
            handleChange={handleChange}
          />
        )}
        <br />
        <br />
        <Grid
          container
          spacing={2}
          sx={{
            flexGrow: 1,
            flexDirection: "row",
          }}
        >
          {card}
        </Grid>
      </div>
    );
  }
}

export default CommunityPosts;
