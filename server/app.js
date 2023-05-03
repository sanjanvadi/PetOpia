import express from "express";
import configRoutes from "../server/routes/index.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// app.get("/", (req, res) => {
//   res.json({ message: "Hello from PetOpia!" });
// });

configRoutes(app);

app.listen(8000, () => {
  console.log("Server listening on http://localhost:8000");
});
