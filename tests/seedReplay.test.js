import { describe, beforeAll, afterAll, it, expect } from '@jest/globals';
import mongoose from 'mongoose';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execute = promisify(execFile);
const dbName = 'lms_brief3_seed_test';
const uri = `mongodb://127.0.0.1:27017/${dbName}`;
const replay = () => execute(process.execPath, ['src/seed/seed.js'], {
  env: { ...process.env, NODE_ENV: 'test', MONGO_URI: uri, SEED_DB_NAME: dbName, EMAIL_DRIVER: 'log',
    SEED_TRAINER_PASSWORD: 'seed-test-only-password', SEED_LEARNER_PASSWORD: 'seed-test-only-password', SEED_ADMIN_PASSWORD: 'seed-test-only-password' },
  timeout: 30000,
});
describe('Seed replay preservation on isolated database', () => {
  let connection;
  beforeAll(async () => {
    connection = await mongoose.createConnection(uri, { serverSelectionTimeoutMS: 5000 }).asPromise();
    if (connection.name !== dbName) throw new Error('Wrong seed test database');
    await replay();
  }, 30000);
  afterAll(async () => {
    if (connection) {
      try { if (connection.name === dbName) await connection.dropDatabase(); }
      finally { await connection.close(); }
    }
  });
  it('preserves completed and cancelled enrollments, progress rows and attempts on replay', async () => {
    const enrollments = connection.collection('enrollments');
    const users = connection.collection('users');
    const learner = await users.findOne({ email: 'learner@example.com' });
    const inactive = await users.findOne({ email: 'inactive@example.com' });
    const nodeEnrollment = await enrollments.findOne({ learner: learner._id });
    const inactiveEnrollment = await enrollments.findOne({ learner: inactive._id });
    const courses = connection.collection('courses');
    const nodeCourse = await courses.findOne({ _id: nodeEnrollment.courseId });
    const modules = await connection.collection('modules').find({ course: nodeCourse._id }).toArray();
    const resources = await connection.collection('resources').find({ module: { $in: modules.map(item => item._id) } }).toArray();
    const progress = connection.collection('resourceprogresses');
    for (const resource of resources) await progress.updateOne({ enrollment: nodeEnrollment._id, resource: resource._id }, { $setOnInsert: { completedAt: new Date() } }, { upsert: true });
    const timestamp = new Date('2026-01-01T00:00:00Z');
    await enrollments.updateOne({ _id: nodeEnrollment._id }, { $set: { progress: 100, updatedAt: timestamp } });
    await enrollments.updateOne({ _id: inactiveEnrollment._id }, { $set: { status: false, progress: 50, cancelledAt: timestamp, updatedAt: timestamp } });
    const before = await enrollments.find({}).sort({ _id: 1 }).toArray();
    const counts = await Promise.all(['users', 'courses', 'modules', 'resources', 'enrollments', 'resourceprogresses', 'quizzes', 'quizattempts'].map(name => connection.collection(name).countDocuments()));
    await replay();
    expect(await enrollments.find({}).sort({ _id: 1 }).toArray()).toEqual(before);
    expect(await Promise.all(['users', 'courses', 'modules', 'resources', 'enrollments', 'resourceprogresses', 'quizzes', 'quizattempts'].map(name => connection.collection(name).countDocuments()))).toEqual(counts);
    const attempt = await connection.collection('quizattempts').findOne({ learnerId: learner._id });
    expect(attempt.score).toBe(67); expect(attempt.passed).toBe(true);
  }, 30000);
});
