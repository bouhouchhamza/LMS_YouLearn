import { jest, it, expect, beforeEach, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
const findQuiz = jest.fn();
const createAttempt = jest.fn();
const sendQuizPassedEmail = jest.fn();
const sendQuizFailedEmail = jest.fn();
jest.unstable_mockModule('../src/models/Quiz.js', () => ({ default: { findOne: findQuiz } }));
jest.unstable_mockModule('../src/models/QuizAttempt.js', () => ({ default: { create: createAttempt } }));
jest.unstable_mockModule('../src/services/email/emailService.js', () => ({ sendQuizPassedEmail, sendQuizFailedEmail }));
jest.unstable_mockModule('../src/middlewares/authMiddleware.js', () => ({ authMiddleware: (req, res, next) => {
  req.user = { _id: 'learner-id', email: 'learner@example.test', fullName: 'Alice' }; next();
} }));
const { default: router } = await import('../src/routes/quizzesRoutes.js');
const app = express(); app.use(express.json()); app.use('/api/quizzes', router);
app.use((error, req, res, next) => res.status(500).json({ message: 'Operation failed' }));
const answer = { questionId: 'question-id', selectedAnswer: 1 };
const submit = (answers = [answer]) => request(app).post('/api/quizzes/modules/module-id/quizzes/answer').send({ answers });
beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  findQuiz.mockResolvedValue({ _id: 'quiz-id', title: 'Node.js Quiz', passingScore: 10, questions: [{ _id: 'question-id', correctAnswer: 1 }] });
  createAttempt.mockImplementation(async (data) => ({ _id: 'attempt-id', ...data }));
  sendQuizPassedEmail.mockResolvedValue({ success: true });
  sendQuizFailedEmail.mockResolvedValue({ success: true });
});
afterEach(() => jest.restoreAllMocks());
it.each([[10, true], [11, false]])('respects passingScore %s without changing scoring', async (passingScore, passed) => {
  const quiz = await findQuiz(); quiz.passingScore = passingScore;
  const selected = passed ? sendQuizPassedEmail : sendQuizFailedEmail;
  selected.mockImplementation(async () => {
    expect(createAttempt).toHaveBeenCalledTimes(1);
    expect(createAttempt.mock.invocationCallOrder[0]).toBeLessThan(selected.mock.invocationCallOrder[0]);
    return { success: true };
  });
  const response = await submit();
  expect(response.status).toBe(201);
  expect(response.body.data).toEqual({ score: 10, passed });
  expect(createAttempt).toHaveBeenCalledWith({ learnerId: 'learner-id', quizId: 'quiz-id', score: 10, submittedAnswers: [answer], passed });
  expect(selected).toHaveBeenCalledTimes(1); expect(selected).toHaveBeenCalledWith({ to: 'learner@example.test', learnerName: 'Alice', quizTitle: 'Node.js Quiz', score: 10 });
  expect(passed ? sendQuizFailedEmail : sendQuizPassedEmail).not.toHaveBeenCalled();
});
it('uses persisted outcome and score for the notification', async () => {
  createAttempt.mockResolvedValue({ passed: false, score: 7 });
  expect((await submit()).status).toBe(201);
  expect(sendQuizFailedEmail).toHaveBeenCalledWith(expect.objectContaining({ score: 7 }));
  expect(sendQuizPassedEmail).not.toHaveBeenCalled();
});
it.each([true, false])('does not duplicate notifications for duplicate answers (passed=%s)', async (passed) => {
  if (!passed) answer.selectedAnswer = 0;
  try {
    expect((await submit([answer, answer])).status).toBe(201);
    expect(createAttempt).toHaveBeenCalledTimes(1);
    expect(createAttempt.mock.calls[0][0].submittedAnswers).toHaveLength(1);
    expect(sendQuizPassedEmail.mock.calls.length + sendQuizFailedEmail.mock.calls.length).toBe(1);
  } finally { answer.selectedAnswer = 1; }
});
it.each(['missing quiz', 'lookup failure', 'save failure', 'invalid answers'])('does not notify after %s', async (scenario) => {
  if (scenario === 'missing quiz') findQuiz.mockResolvedValue(null);
  if (scenario === 'lookup failure') findQuiz.mockRejectedValue(new Error('Lookup failed'));
  if (scenario === 'save failure') createAttempt.mockRejectedValue(new Error('Save failed'));
  const response = await submit(scenario === 'invalid answers' ? null : [answer]);
  expect(response.status).toBe(scenario === 'missing quiz' ? 404 : 500);
  expect(sendQuizPassedEmail).not.toHaveBeenCalled(); expect(sendQuizFailedEmail).not.toHaveBeenCalled();
});
it.each([[true, 'reject'], [false, 'reject'], [true, 'result'], [false, 'result']])('preserves saved submission on email failure passed=%s type=%s', async (passed, failure) => {
  createAttempt.mockImplementation(async (data) => ({ ...data, passed }));
  const selected = passed ? sendQuizPassedEmail : sendQuizFailedEmail;
  if (failure === 'reject') selected.mockRejectedValue(new Error('secret-token smtp-password recipient@example.test'));
  else selected.mockResolvedValue({ success: false, transport: 'smtp' });
  const response = await submit();
  expect(response.status).toBe(201); expect(response.body.data).toEqual({ score: 10, passed });
  expect(selected).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith('Quiz result saved, but email notification failed');
  expect(JSON.stringify(console.error.mock.calls)).not.toMatch(/secret-token|smtp-password|recipient@example/);
});
it('keeps separate submissions as separate attempts with one notification each', async () => {
  expect((await submit()).status).toBe(201); expect((await submit()).status).toBe(201);
  expect(createAttempt).toHaveBeenCalledTimes(2); expect(sendQuizPassedEmail).toHaveBeenCalledTimes(2);
});
