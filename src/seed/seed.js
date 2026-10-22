// require("dotenv").config();
import "dotenv/config";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import User from "../models/User.js";

async function seedDatabase() {
  try {
    if (process.env.NODE_ENV === "production") {
      throw new Error("can't run seeder on production envirenment");
    }

    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is reuired");
    }
    const mongoUrl = new URL(process.env.MONGO_URI);
    const dbName = mongoUrl.pathname.slice(1);

    if (dbName !== "lms_seed_test") {
      throw new Error("Database not alloed for seeding");
    }

    if (mongoUrl.protocol !== "mongodb:") {
      throw new Error("only local mongodb:// connections are allowed");
    }
    if (!["127.0.0.1", "localhost"].includes(mongoUrl.hostname)) {
      throw new Error("Seeder allowed only on local MongoDB");
    }
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDb connected");
    let trainer = await User.findOne({
      email: "trainer@example.com",
    });
    if (!trainer) {
      if (!process.env.SEED_TRAINER_PASSWORD) {
        throw new Error("SEED_TRAINER_PASSWORD is required");
      }
      trainer = await User.create({
        fullName: "trainer",
        email: "trainer@example.com",
        password: process.env.SEED_TRAINER_PASSWORD,
        role: "trainer",
      });
    }
    if (trainer.role !== "trainer") {
      throw new Error("Seed user exists but is not a trainer");
    }


    let learner = await User.findOne({ email: "learner@example.com", });
    if (!learner) {
      if (!process.env.SEED_LEARNER_PASSWORD) {
        throw new Error("SEED_LEARNER_PASSWORD is required !")
      }
      await User.create({
        fullName: "Demo Learner",
        email: "learner@example.com",
        password: process.env.SEED_LEARNER_PASSWORD,
        role: "learner",
        status: true,
      });
      console.log("Learner seeded succsefully");
    }


    const nodeCourse = await Course.findOneAndUpdate(
      { seedKey: "demo-node-fundamentals" },
      {
        $setOnInsert: {
          title: "Node.js Fundamentals",
          description:
            "Learn the fundamentals of Node.js and backend development.",
          category: "Backend",
          level: "beginner",
          status: "published",
          publishedAt: new Date("2026-09-20"),
          trainer: trainer._id,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    const expressCourse = await Course.findOneAndUpdate(
      { seedKey: "demo-express-api" },
      {
        $setOnInsert: {
          title: "Express.js API Development",
          description: "Build REST APIs using Express.js.",
          category: "Backend",
          level: "intermediate",
          status: "published",
          publishedAt: new Date("2026-09-25"),
          trainer: trainer._id,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    const mongoCourse = await Course.findOneAndUpdate(
      { seedKey: "demo-advanced-mongodb" },
      {
        $setOnInsert: {
          title: "Advanced MongoDB",
          description: "Advanced MongoDB concepts and database optimization.",
          category: "Database",
          level: "advanced",
          status: "draft",
          publishedAt: null,
          trainer: trainer._id,
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    const nodeIntroModule = await Module.findOneAndUpdate(
      { course: nodeCourse._id, order: 1 },
      {
        $setOnInsert: {
          title: "Introduction to Node.js",
          description: "Discover Node.js and its runtime",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    const nodeModulesModule = await Module.findOneAndUpdate(
      { course: nodeCourse._id, order: 2 },
      {
        $setOnInsert: {
          title: "Node.js Modules",
          description: "Learn how modules work in Node.js.",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );

    const expressIntroModule = await Module.findOneAndUpdate(
      { course: expressCourse._id, order: 1 },
      {
        $setOnInsert: {
          title: "Introduction to Express",
          description: "Learn the basics of Express.js.",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    await Resource.findOneAndUpdate(
      { module: nodeIntroModule._id, order: 1 },
      {
        $setOnInsert: {
          title: "What is Node.js?",
          type: "video",
          url: "https://example.com/node-introduction",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    await Resource.findOneAndUpdate(
      { module: nodeIntroModule._id, order: 2 },
      {
        $setOnInsert: {
          title: "Node.js Runtime Notes",
          type: "pdf",
          url: "https://example.com/node-runtime.pdf",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    await Resource.findOneAndUpdate(
      { module: nodeModulesModule._id, order: 1 },
      {
        $setOnInsert: {
          title: "CommonJS Modules",
          type: "text",
          content: "Introduction to require and module.exports.",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    await Resource.findOneAndUpdate(
      { module: expressIntroModule._id, order: 1 },
      {
        $setOnInsert: {
          title: "Express Documentation",
          type: "link",
          url: "https://expressjs.com",
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
      },
    );
    console.log("Seed completed successfully");
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
