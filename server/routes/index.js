import pets from "./pet.js";
import user from "./user.js";
import communityPostsRoute from "./communityPosts.js";
import commentsRoute from "./comments.js";
import likesRoute from "./likes.js";

const constructorMethod = (app) => {
  app.use("/community-posts", communityPostsRoute);
  app.use("/view-post", commentsRoute);
  app.use("/likes", likesRoute);
  app.use("/account/pets", pets);
  app.use("/user", user);

  app.use("*", (req, res) => {
    res.status(404).send("Page Not Found!");
  });
};

export default constructorMethod;
