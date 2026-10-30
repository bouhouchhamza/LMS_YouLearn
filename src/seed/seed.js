// require("dotenv").config();
import "dotenv/config";
import mongoose from "mongoose";
import Course from "../models/Course.js";
import Module from "../models/Module.js";
import Resource from "../models/Resource.js";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import QuizAttempt from "../models/QuizAttempt.js";
import ResourceProgress from "../models/ResourceProgress.js"
import Enrollment from "../models/Enrollment.js";


const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);
const INACTIVE_DAYS = Number(process.env.INACTIVE_DAYS || 30);

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

    const allowedDb = process.env.SEED_DB_NAME || "lms_seed_test";
    if (dbName !== allowedDb) {
      throw new Error(
        `Seeder only allowed on database "${allowedDb}" (received "${dbName}"). Set SEED_DB_NAME to override.`,
      );
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
        learner = await User.create({
        fullName: "Demo Learner",
        email: "learner@example.com",
        password: process.env.SEED_LEARNER_PASSWORD,
        role: "learner",
        status: true,
      });
      console.log("Learner seeded succsefully");
    }
    
    let inactiveLearner = await User.findOne({
      email: "inactive@example.com",
    });
    if (!inactiveLearner) {
      if (!process.env.SEED_LEARNER_PASSWORD) {
        throw new Error("SEED_LEARNER_PASSWORD is required");
      }
      inactiveLearner = await User.create({
        fullName: "Inactive Learner",
        email: "inactive@example.com",
        password: process.env.SEED_LEARNER_PASSWORD,
        role: "learner",
        status: true,
      });
      console.log("Inactive learner seeded successfully");
    }

    let admin = await User.findOne({ email: "admin@example.com" });
    if (!admin) {
      if (!process.env.SEED_ADMIN_PASSWORD) {
        throw new Error("SEED_ADMIN_PASSWORD is required");
      }
      admin = await User.create({
        fullName: "Platform Admin",
        email: "admin@example.com",
        password: process.env.SEED_ADMIN_PASSWORD,
        role: "admin",
        status: true,
      });
      console.log("Admin seeded successfully");
    }
    if (admin.role !== "admin") {
      throw new Error("Seed user exists but is not an admin");
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
    const nodeIntroVideo = await Resource.findOneAndUpdate(
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

    // --- Brief 3 demo journey: one quiz, one enrollment, one progress, one attempt ---
    const nodeCourseModuleIds = [nodeIntroModule._id, nodeModulesModule._id];
    const nodeCourseResourceCount = await Resource.countDocuments({
      module: { $in: nodeCourseModuleIds },
    });

    const nodeQuiz = await Quiz.findOneAndUpdate(
      { moduleId: nodeIntroModule._id },
      {
        $setOnInsert: {
          title: "Node.js Fundamentals Quiz",
          passingScore: 60,
          questions: [
            {
              question: "What is Node.js?",
              options: [
                "A browser",
                "A JavaScript runtime",
                "A database",
                "A CSS framework",
              ],
              correctAnswer: 1,
            },
            {
              question: "Which module system is built into Node.js?",
              options: ["CommonJS", "SASS", "JSX", "SQL"],
              correctAnswer: 0,
            },
            {
              question: "Which object exposes the current module?",
              options: ["window", "document", "module", "process.env"],
              correctAnswer: 2,
            },
          ],
        },
      },
      {
        upsert: true,
        returnDocument: "after",
        runValidators: true,
        setDefaultsOnInsert: true,
      },
    );

    let nodeEnrollment = await Enrollment.findOne({
      learner: learner._id,
      courseId: nodeCourse._id,
    });
    if (!nodeEnrollment) {
      nodeEnrollment = await Enrollment.create({
        learner: learner._id,
        courseId: nodeCourse._id,
        status: true,
        progress: 0,
      });
    }

    await ResourceProgress.findOneAndUpdate(
      { enrollment: nodeEnrollment._id, resource: nodeIntroVideo._id },
      { $setOnInsert: { completedAt: daysAgo(5) } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    );

    const completedProgress =
      nodeCourseResourceCount > 0
        ? Number(((1 / nodeCourseResourceCount) * 100).toFixed(2))
        : 0;

    // Old but recent activity: this learner is active, not inactive.
    // Native update: Mongoose treats createdAt as immutable.
    await Enrollment.collection.updateOne(
      { _id: nodeEnrollment._id },
      {
        $set: {
          status: true,
          progress: completedProgress,
          createdAt: daysAgo(30),
          updatedAt: daysAgo(2),
        },
      },
    );

    if (nodeQuiz.questions.length >= 3) {
      const existingAttempt = await QuizAttempt.findOne({
        learnerId: learner._id,
        quizId: nodeQuiz._id,
      });
      if (!existingAttempt) {
        // Two correct answers out of three: 67/100, above passingScore 60.
        const submittedAnswers = nodeQuiz.questions.map((question, index) => ({
          questionId: question._id,
          selectedAnswer:
            index < 2
              ? question.correctAnswer
              : (question.correctAnswer + 1) % question.options.length,
        }));
        const correctCount = submittedAnswers.filter(
          (answer, index) =>
            answer.selectedAnswer === nodeQuiz.questions[index].correctAnswer,
        ).length;
        const score = Math.round(
          (correctCount / nodeQuiz.questions.length) * 100,
        );
        await QuizAttempt.create({
          learnerId: learner._id,
          quizId: nodeQuiz._id,
          score,
          submittedAnswers,
          passed: score >= nodeQuiz.passingScore,
        });
      }
    }

    // Second learner enrolled 60 days ago with zero progress: inactive demo case.
    let inactiveEnrollment = await Enrollment.findOne({
      learner: inactiveLearner._id,
      courseId: expressCourse._id,
    });
    if (!inactiveEnrollment) {
      inactiveEnrollment = await Enrollment.create({
        learner: inactiveLearner._id,
        courseId: expressCourse._id,
        status: true,
        progress: 0,
      });
    }
    await Enrollment.collection.updateOne(
      { _id: inactiveEnrollment._id },
      {
        $set: {
          status: true,
          progress: 0,
          createdAt: daysAgo(60),
          updatedAt: daysAgo(INACTIVE_DAYS + 15), // Qualifies as inactive (> 30 days),
        },
      },
    );

    console.log("Seed completed successfully");
    console.log(
      "Demo accounts: trainer@example.com, learner@example.com, inactive@example.com, admin@example.com",
    );
    console.log(
      `Demo journey: quiz "${nodeQuiz.title}", enrollment progress ${completedProgress}%, one quiz attempt`,
    );
  } catch (error) {
    console.error(`Seed error: ${error.message}`);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

seedDatabase();
