import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";

dotenv.config();
let _connection = undefined;
let _db = undefined;

const dbConnection = async () => {
  if (!_connection) {
    _connection = await MongoClient.connect(process.env.DATABASE_URL);
    _db = await _connection.db(process.env.DATABASE_NAME);
  }

  return _db;
};
const closeConnection = () => {
  _connection.close();
};

export { dbConnection, closeConnection };
