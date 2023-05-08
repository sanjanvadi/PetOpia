import { ObjectId } from "mongodb";
import { users } from "../config/mongoCollections.js";
import { notFoundError } from "../helpers/wrappers.js";
import redis from "redis";
const client = redis.createClient();
client.connect();

const createUser = async (email) => {
  const collection = await users();
  const newUser = {
    email,
    pets: [],
  };
  let user = await collection.findOne({
    email: email.toString(),
  });
  if (!user) {
    let insertInfo = await collection.insertOne(newUser);
    if (insertInfo.insertedCount === 0) {
      throw "Error : Could not add user";
    }
    let id = insertInfo.insertedId.toString();
    await client.set(email, id);
    return { id };
  } else {
    await client.set(user.email.toString(), user._id.toString());
    return { id: user._id.toString() };
  }
};

const getUserById = async (userId) => {
  const collection = await users();
  const userById = await collection.findOne({ _id: new ObjectId(userId) });
  if (userById === null) throw notFoundError("User doesn't exist!");
  userById._id = userById._id.toString();
  return userById;
};

export { createUser, getUserById };
