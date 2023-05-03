import communityPostsRoute from "./communityPosts.js";
import commentsRoute from "./comments.js";
import likesRoute from "./likes.js";
import pets from './pet.js'

const constructorMethod = (app) => {
  app.use("/community-posts", communityPostsRoute);
  app.use("/view-post", commentsRoute);
  app.use("/likes", likesRoute);
  app.use('/pets', pets);
  
  app.use("*", (req, res) => {
    res.status(404).send("Page Not Found!");
  });
};

export default constructorMethod;
