import { randomUUID } from 'node:crypto';
import { beforeAll, afterAll, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Feedback from '../src/models/Feedback.js';
const fixtureId = randomUUID();
describe('Feedback read authorization', () => {
let users = [], course, feedback;
const read = (user, path) => request(app).get(path).set('Authorization', `Bearer ${jwt.sign({ id: user._id }, process.env.JWT_SECRET)}`);
beforeAll(async () => {
  users = await Promise.all(['trainer', 'trainer', 'learner', 'learner', 'admin'].map((role, i) => User.create({ fullName: 'Feedback regression', email: `feedback-regression-${fixtureId}-${i}@example.test`, password: 'test-only-password', role })));
  course = await Course.create({ title: 'Feedback regression', description: 'Fixture', category: 'Test', level: 'beginner', trainer: users[0]._id });
  feedback = await Feedback.create({ trainerId: users[0]._id, learnerId: users[2]._id, courseId: course._id, content: 'Keep learning' });
});
afterAll(async () => {
  if (feedback) await Feedback.deleteOne({ _id: feedback._id });
  if (course) await Course.deleteOne({ _id: course._id });
  await User.deleteMany({ _id: { $in: users.map(user => user._id) } });
});
it('lets the owner read feedback for the requested learner', async () => {
  const response = await read(users[0], `/api/feedback/courses/${course._id}/learners/${users[2]._id}`);
  expect(response.status).toBe(200); expect(response.body.data[0]._id).toBe(String(feedback._id));
});
it('rejects an unrelated trainer', async () => {
  expect((await read(users[1], `/api/feedback/courses/${course._id}/learners/${users[2]._id}`)).status).toBe(403);
});
it('allows admin review on the existing admin route', async () => {
  expect((await read(users[4], `/api/feedback/courses/${course._id}/learners/${users[2]._id}`)).status).toBe(200);
});
it('keeps learner reads restricted to their own feedback', async () => {
  const path = `/api/feedback/courses/${course._id}/feedback`;
  expect((await read(users[2], path)).status).toBe(200);
  expect((await read(users[3], path)).status).toBe(404);
  expect((await read(users[2], `/api/feedback/courses/${course._id}/learners/${users[3]._id}`)).status).toBe(403);
});

});
