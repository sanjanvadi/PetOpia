import communityPostsRoute from "./communityPosts.js";
import commentsRoute from "./comments.js";
import likesRoute from "./likes.js";

const constructorMethod = (app) => {
  app.use("/community-posts", communityPostsRoute);
  app.use("/view-post", commentsRoute);
  app.use("/likes", likesRoute);
  
  app.use("*", (req, res) => {
    res.status(404).send("Page Not Found!");
  });
};

export default constructorMethod;
