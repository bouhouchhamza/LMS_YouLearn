// require("dotenv").config();
import "dotenv/config";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";

async function seedDatabase() {
    try{
  await mongoose.connect(process.env.MONGO_URI);
  console.log("MongoDb connected");

  await Resource.deleteMany();
  await Module.deleteMany();
  await Course.deleteMany();

  const courses = await Course.insertMany([
    {
      title: "Node.js Fundamentals",
      description: "Learn the fundamentals of Node.js and backend development.",
      category: "Backend",
      level: "beginner",
      status: "published",
      publishedAt: new Date("2026-09-20"),
    },
    {
      title: "Express.js API Development",
      description: "Build REST APIs using Express.js.",
      category: "Backend",
      level: "intermediate",
      status: "published",
      publishedAt: new Date("2026-09-25"),
    },
    {
      title: "Advanced MongoDB",
      description: "Advanced MongoDB concepts and database optimization.",
      category: "Database",
      level: "advanced",
      status: "draft",
      publishedAt: null,
    },
  ]);

  const nodeCourse = courses[0];
  const expressCourse = courses[1];

  const modules = await Module.insertMany([
    {
      title: "Introduction to Node.js",
      description: "Discover Node.js and its runtime.",
      order: 1,
      course: nodeCourse._id,
    },
    {
      title: "Node.js Modules",
      description: "Learn how modules work in Node.js.",
      order: 2,
      course: nodeCourse._id,
    },
    {
      title: "Introduction to Express",
      description: "Learn the basics of Express.js.",
      order: 1,
      course: expressCourse._id,
    },
  ]);
  const nodeIntroModule = modules[0];
  const nodeModulesModule = modules[1];
  const expressIntroModule = modules[2];

  await Resource.insertMany([
    {
      title: "What is Node.js?",
      type: "video",
      url: "https://example.com/node-introduction",
      order: 1,
      module: nodeIntroModule._id,
    },
    {
      title: "Node.js Runtime Notes",
      type: "pdf",
      url: "https://example.com/node-runtime.pdf",
      order: 2,
      module: nodeIntroModule._id,
    },
    {
      title: "CommonJS Modules",
      type: "text",
      content: "Introduction to require and module.exports.",
      order: 1,
      module: nodeModulesModule._id,
    },
    {
      title: "Express Documentation",
      type: "link",
      url: "https://expressjs.com",
      order: 1,
      module: expressIntroModule._id,
    },
  ]);
  console.log('Seed completed successfully');
}catch(error){
    console.error(`Seed error: ${error.message}`);
}finally{
    await mongoose.disconnect();
}
}

seedDatabase();
