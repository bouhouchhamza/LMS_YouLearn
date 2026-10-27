import { jest, it, expect, beforeEach, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
const findById = jest.fn();
const findOne = jest.fn();
const save = jest.fn();
const sendEnrollmentEmail = jest.fn();
jest.unstable_mockModule('../src/models/Course.js', () => ({ default: { findById } }));
jest.unstable_mockModule('../src/models/Enrollment.js', () => ({ default: class { static findOne = findOne; save(...args) { return save(...args); } } }));
jest.unstable_mockModule('../src/services/email/emailService.js', () => ({ sendEnrollmentEmail, sendEnrollmentCancelledEmail: jest.fn() }));
const { enroll } = await import('../src/controllers/enrollmentController.js');
const app = express();
app.post('/courses/:courseId/enroll', (req, res, next) => {
  req.user = { _id: 'learner-id', email: 'learner@example.test', fullName: 'Alice' };
  next();
}, enroll);
app.use((error, req, res, next) => res.status(500).json({ message: 'Operation failed' }));
const enrollRequest = () => request(app).post('/courses/course-id/enroll');
beforeEach(() => {
  jest.resetAllMocks();
  jest.spyOn(console, 'error').mockImplementation(() => {});
  findById.mockResolvedValue({ status: 'published', title: 'Node.js' });
  findOne.mockResolvedValue(null);
  save.mockResolvedValue({});
  sendEnrollmentEmail.mockResolvedValue({ success: true });
});
afterEach(() => jest.restoreAllMocks());
it('sends once, after the enrollment is saved', async () => {
  sendEnrollmentEmail.mockImplementation(async () => {
    expect(save).toHaveBeenCalledTimes(1);
    return { success: true };
  });
  expect((await enrollRequest()).status).toBe(201);
  expect(sendEnrollmentEmail).toHaveBeenCalledTimes(1);
  expect(sendEnrollmentEmail).toHaveBeenCalledWith({ to: 'learner@example.test', learnerName: 'Alice', courseTitle: 'Node.js' });
});
it.each(['result', 'rejection'])('keeps HTTP 201 on email failure: %s', async (failure) => {
  if (failure === 'result') sendEnrollmentEmail.mockResolvedValue({ success: false });
  else sendEnrollmentEmail.mockRejectedValue(new Error('secret'));
  expect((await enrollRequest()).status).toBe(201);
  expect(JSON.stringify(console.error.mock.calls)).not.toContain('secret');
});
it.each([['missing', 404], ['draft', 403], ['duplicate', 409], ['save', 500], ['concurrent duplicate', 500], ['lookup', 500]])('does not send when operation fails: %s', async (scenario, status) => {
  if (scenario === 'missing') findById.mockResolvedValue(null);
  if (scenario === 'draft') findById.mockResolvedValue({ status: 'draft' });
  if (scenario === 'duplicate') findOne.mockResolvedValue({ status: true });
  if (scenario === 'save') save.mockRejectedValue(new Error('Save failed'));
  if (scenario === 'concurrent duplicate') save.mockRejectedValue(Object.assign(new Error('Duplicate'), { code: 11000 }));
  if (scenario === 'lookup') findById.mockRejectedValue(new Error('Lookup failed'));
  expect((await enrollRequest()).status).toBe(status);
  expect(sendEnrollmentEmail).not.toHaveBeenCalled();
});
it('does not send again when a successful enrollment is repeated', async () => {
  expect((await enrollRequest()).status).toBe(201);
  findOne.mockResolvedValue({ status: true });
  expect((await enrollRequest()).status).toBe(409);
  expect(sendEnrollmentEmail).toHaveBeenCalledTimes(1);
});
