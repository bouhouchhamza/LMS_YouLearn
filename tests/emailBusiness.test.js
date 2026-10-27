import { jest, it, expect, beforeEach, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
const userFind = jest.fn(), userSave = jest.fn(), cancelUpdate = jest.fn(), courseFind = jest.fn();
const sendWelcomeEmail = jest.fn(), sendEnrollmentCancelledEmail = jest.fn();
jest.unstable_mockModule('../src/models/User.js', () => ({ default: class { static findOne = userFind; constructor(data) { Object.assign(this, data); } save() { return userSave(); } } }));
jest.unstable_mockModule('../src/models/Course.js', () => ({ default: { findById: courseFind } }));
jest.unstable_mockModule('../src/models/Enrollment.js', () => ({ default: { findOneAndUpdate: cancelUpdate } }));
jest.unstable_mockModule('../src/services/email/emailService.js', () => ({ sendWelcomeEmail, sendEnrollmentCancelledEmail, sendEnrollmentEmail: jest.fn() }));
const { register } = await import('../src/controllers/authController.js');
const { cancelEnroll } = await import('../src/controllers/enrollmentController.js');
const app = express(); app.use(express.json());
app.post('/register', register);
app.delete('/courses/:courseId/enroll', (req, res, next) => { req.user = { _id: 'learner-id', email: 'learner@example.test', fullName: 'Alice' }; next(); }, cancelEnroll);
app.use((error, req, res, next) => res.status(500).json({ message: 'Failed' }));
const registerRequest = () => request(app).post('/register').send({ fullName: 'Alice', email: 'learner@example.test', password: 'fake' });
const cancelRequest = () => request(app).delete('/courses/course-id/enroll');
beforeEach(() => {
 jest.resetAllMocks(); jest.spyOn(console, 'error').mockImplementation(() => {});
 userFind.mockResolvedValue(null); userSave.mockResolvedValue({}); cancelUpdate.mockResolvedValue({}); courseFind.mockResolvedValue({ title: 'Node.js' });
});
afterEach(() => jest.restoreAllMocks());
it('welcomes only after account save and excludes passwords', async () => {
 sendWelcomeEmail.mockImplementation(async () => { expect(userSave).toHaveBeenCalledTimes(1); });
 expect((await registerRequest()).status).toBe(201);
 expect(sendWelcomeEmail).toHaveBeenCalledWith({ to: 'learner@example.test', fullName: 'Alice' });
});
it.each(['duplicate', 'save'])('does not welcome after account failure: %s', async (failure) => {
 if (failure === 'duplicate') userFind.mockResolvedValue({}); else userSave.mockRejectedValue(new Error('Failed'));
 expect((await registerRequest()).status).toBe(failure === 'duplicate' ? 409 : 500);
 expect(sendWelcomeEmail).not.toHaveBeenCalled();
});
it('keeps account creation successful when email throws', async () => {
 sendWelcomeEmail.mockRejectedValue(new Error('secret'));
 expect((await registerRequest()).status).toBe(201);
 expect(JSON.stringify(console.error.mock.calls)).not.toContain('secret');
});
it('cancels atomically and notifies once for repeated cancellation', async () => {
 sendEnrollmentCancelledEmail.mockImplementation(async () => { expect(cancelUpdate).toHaveBeenCalledTimes(1); });
 expect((await cancelRequest()).status).toBe(200);
 expect(cancelUpdate).toHaveBeenCalledWith({ learner: 'learner-id', courseId: 'course-id', status: true }, { $set: { status: false, cancelledAt: expect.any(Date) } }, { new: true });
 cancelUpdate.mockResolvedValue(null);
 expect((await cancelRequest()).status).toBe(404);
 expect(sendEnrollmentCancelledEmail).toHaveBeenCalledTimes(1);
});
it.each(['email', 'course'])('preserves cancellation despite notification failure: %s', async (failure) => {
 if (failure === 'email') sendEnrollmentCancelledEmail.mockRejectedValue(new Error('secret'));
 else courseFind.mockRejectedValue(new Error('secret'));
 expect((await cancelRequest()).status).toBe(200);
 expect(JSON.stringify(console.error.mock.calls)).not.toContain('secret');
});
it('does not send after failed cancellation persistence', async () => {
 cancelUpdate.mockRejectedValue(new Error('Failed'));
 expect((await cancelRequest()).status).toBe(500);
 expect(sendEnrollmentCancelledEmail).not.toHaveBeenCalled();
});
