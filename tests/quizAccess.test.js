import { randomUUID } from 'node:crypto';
import { beforeAll, afterAll, beforeEach, describe, it, expect } from '@jest/globals';
import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/app.js';
import User from '../src/models/User.js';
import Course from '../src/models/Course.js';
import Module from '../src/models/Module.js';
import Resource from '../src/models/Resource.js';
import Enrollment from '../src/models/Enrollment.js';
import ResourceProgress from '../src/models/ResourceProgress.js';
import Quiz from '../src/models/Quiz.js';
import QuizAttempt from '../src/models/QuizAttempt.js';
const fixtureId = randomUUID();
describe('Quiz access and scoring', () => {
let learner, trainer, outsider, admin, course, previous, module, resource, quiz, enrollment;
const token = user => jwt.sign({ id: user._id }, process.env.JWT_SECRET);
const endpoint = () => `/api/quizzes/modules/${module._id}/quizzes`;
const read = user => request(app).get(endpoint()).set('Authorization', `Bearer ${token(user)}`);
const submit = (user, answers) => request(app).post(`${endpoint()}/answer`).set('Authorization', `Bearer ${token(user)}`).send({ answers });
beforeAll(async () => {
  [learner, trainer, outsider, admin] = await Promise.all(['learner', 'trainer', 'trainer', 'admin'].map((role, i) => User.create({ fullName: 'Quiz regression', email: `quiz-regression-${fixtureId}-${i}@example.test`, password: 'test-only-password', role })));
  course = await Course.create({ title: 'Quiz regression', description: 'Regression fixture', category: 'Test', level: 'beginner', status: 'published', trainer: trainer._id });
  previous = await Module.create({ title: 'Previous', course: course._id, order: 1 });
  module = await Module.create({ title: 'Quiz module', course: course._id, order: 2 });
  resource = await Resource.create({ title: 'Previous resource', type: 'text', content: 'Test', module: previous._id, order: 1 });
  quiz = await Quiz.create({ title: 'Three questions', moduleId: module._id, passingScore: 60, questions: [1, 2, 3].map(i => ({ question: `Question ${i}`, options: ['Yes', 'No'], correctAnswer: 0 })) });
  enrollment = await Enrollment.create({ learner: learner._id, courseId: course._id });
});
beforeEach(async () => {
  await Enrollment.updateOne({ _id: enrollment._id }, { status: true });
  await ResourceProgress.deleteMany({ enrollment: enrollment._id });
  await QuizAttempt.deleteMany({ quizId: quiz._id });
});
afterAll(async () => {
  if (quiz) await QuizAttempt.deleteMany({ quizId: quiz._id });
  if (enrollment) { await ResourceProgress.deleteMany({ enrollment: enrollment._id }); await Enrollment.deleteOne({ _id: enrollment._id }); }
  if (quiz) await Quiz.deleteOne({ _id: quiz._id });
  if (resource) await Resource.deleteOne({ _id: resource._id });
  if (course) { await Module.deleteMany({ course: course._id }); await Course.deleteOne({ _id: course._id }); }
  await User.deleteMany({ _id: { $in: [learner, trainer, outsider, admin].filter(Boolean).map(user => user._id) } });
});
const unlock = () => ResourceProgress.create({ enrollment: enrollment._id, resource: resource._id });
it('requires authentication', async () => { expect((await request(app).get(endpoint())).status).toBe(401); });
it('rejects inactive enrollment for reads and submissions', async () => {
  await Enrollment.updateOne({ _id: enrollment._id }, { status: false });
  expect((await read(learner)).status).toBe(403);
  expect((await submit(learner, [])).status).toBe(403);
  expect(await QuizAttempt.countDocuments({ quizId: quiz._id })).toBe(0);
});
it('rejects a learner without enrollment', async () => {
  await User.updateOne({ _id: outsider._id }, { role: 'learner' });
  try { expect((await read(outsider)).status).toBe(403); }
  finally { await User.updateOne({ _id: outsider._id }, { role: 'trainer' }); }
});
it('locks the quiz until previous module resources are completed', async () => {
  expect((await read(learner)).status).toBe(403);
  expect((await submit(learner, [])).status).toBe(403);
  await unlock();
  const response = await read(learner);
  expect(response.status).toBe(200);
  expect(JSON.stringify(response.body)).not.toContain('correctAnswer');
});
it('allows owner and admin previews but rejects other trainers', async () => {
  expect((await read(trainer)).status).toBe(200);
  expect((await read(admin)).status).toBe(200);
  expect((await read(outsider)).status).toBe(403);
});
it('prevents trainer and admin submissions', async () => {
  expect((await submit(trainer, [])).status).toBe(403);
  expect((await submit(admin, [])).status).toBe(403);
});
it('returns 400 for malformed module identifiers', async () => {
  expect((await request(app).get('/api/quizzes/modules/invalid/quizzes').set('Authorization', `Bearer ${token(learner)}`)).status).toBe(400);
});
it('scores two of three answers as 67 percent, matching the seed', async () => {
  await unlock();
  const answers = quiz.questions.map((q, i) => ({ questionId: String(q._id), selectedAnswer: i < 2 ? 0 : 1 }));
  const response = await submit(learner, [...answers, answers[0]]);
  expect(response.status).toBe(201);
  expect(response.body.data).toEqual({ score: 67, passed: true });
  const attempt = await QuizAttempt.findOne({ quizId: quiz._id });
  expect(attempt.score).toBe(67); expect(attempt.submittedAnswers).toHaveLength(3);
});
it.each([null, {}, [{ questionId: 'unknown', selectedAnswer: 0 }], 'out-of-range'])('rejects malformed answers: %s', async value => {
  await unlock();
  const answers = value === 'out-of-range' ? [{ questionId: String(quiz.questions[0]._id), selectedAnswer: 2 }] : value;
  expect((await submit(learner, answers)).status).toBe(400);
  expect(await QuizAttempt.countDocuments({ quizId: quiz._id })).toBe(0);
});
it('counts unanswered questions in the denominator', async () => {
  await unlock();
  const response = await submit(learner, [{ questionId: String(quiz.questions[0]._id), selectedAnswer: 0 }]);
  expect(response.body.data).toEqual({ score: 33, passed: false });
});

});
