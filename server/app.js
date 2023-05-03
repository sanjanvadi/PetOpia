import express from "express";
import configRoutes from "../server/routes/index.js";
import session from "express-session";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
  name: 'AuthCookie',
  secret: 'Some secret you will never know!',
  resave: false,
  saveUninitialized: true
}))

// app.get("/", (req, res) => {
//   res.json({ message: "Hello from PetOpia!" });
// });

configRoutes(app);

const PORT = 8000
app.listen(PORT, () => {
  console.log(`Server listening on http://localhost:${PORT}`);
});
