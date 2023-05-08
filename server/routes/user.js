import { Router } from "express";
const router = Router();
import xss from "xss";
import redis from "redis";
import { createUser, getUserById } from "../data/user.js";
const client = redis.createClient();
client.connect();

router.route("/:userId").get(async (req, res) => {
  try {
    const userById = await getUserById(req.params.userId);
    res.json(userById);
  } catch (error) {
    res.status(error.code).send(error.message);
  }
});

router.route("/").post(async (req, res) => {
  let input = req.body;
  let email = xss(input.email);

  let existUser = await client.exists(email);
  let data;
  if (existUser) {
    let id = await client.get(email);
    data = { id };
  } else {
    data = await createUser(email);
  }
  res.status(200).send(data);
});

export default router;
