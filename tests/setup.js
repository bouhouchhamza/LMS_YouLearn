import mongoose from "mongoose";
import { beforeAll, afterAll } from "@jest/globals";
import User from "../src/models/User.js";
const TEST_DB_NAME = 'lms_test_db';
const TEST_MONGO_URI = "mongodb://127.0.0.1:27017/lms_test_db";

beforeAll(async()=>{
    if(process.env.NODE_ENV !== 'test'){
        throw new Error('Tests must run with NODE_ENV=test');
    }
    const connection = await mongoose.connect(TEST_MONGO_URI,{
    serverSelectionTimeoutMS:5000,
});
if(connection.connection.name !== TEST_DB_NAME ){
    await mongoose.disconnect();
    throw new Error('Wrong database: tests aborted');
}
console.log('Connected to test database:', connection.connection.name);
});
afterAll(async () => {
  try {
    if (mongoose.connection.name !== TEST_DB_NAME) {
      throw new Error('Wrong database during cleanup');
    }
    await User.deleteOne({
        email: 'test-login@example.com'
    });
  } finally {
    await mongoose.disconnect();
  }
});
