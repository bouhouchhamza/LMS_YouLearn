import { jest, it, expect, beforeEach, afterEach } from '@jest/globals';
import express from 'express';
import request from 'supertest';
const enrollmentFind = jest.fn(), transition = jest.fn(), save = jest.fn(), resourceFind = jest.fn(), resourceList = jest.fn(), moduleFind = jest.fn(), moduleList = jest.fn(), upsert = jest.fn(), count = jest.fn(), courseFind = jest.fn(), sendCourseCompletedEmail = jest.fn();
jest.unstable_mockModule('../src/models/Enrollment.js', () => ({ default: { findOne: enrollmentFind, findOneAndUpdate: transition } }));
jest.unstable_mockModule('../src/models/Resource.js', () => ({ default: { findById: resourceFind, find: resourceList } }));
jest.unstable_mockModule('../src/models/Module.js', () => ({ default: { findById: moduleFind, find: moduleList } }));
jest.unstable_mockModule('../src/models/ResourceProgress.js', () => ({ default: { findOneAndUpdate: upsert, countDocuments: count } }));
jest.unstable_mockModule('../src/models/Course.js', () => ({ default: { findById: courseFind } }));
jest.unstable_mockModule('../src/services/email/emailService.js', () => ({ sendCourseCompletedEmail }));
const { completeResource } = await import('../src/controllers/progressController.js');
const app = express();
app.post('/resources/:resourceId/complete', (req, res, next) => { req.user = { _id: 'learner', fullName: 'Alice', email: 'learner@example.test' }; next(); }, completeResource);
app.use((error, req, res, next) => res.status(500).json({ message: 'Failed' }));
const complete = () => request(app).post('/resources/507f1f77bcf86cd799439011/complete');
beforeEach(() => {
 jest.resetAllMocks(); jest.spyOn(console, 'error').mockImplementation(() => {}); jest.spyOn(console, 'log').mockImplementation(() => {});
 enrollmentFind.mockResolvedValue({ _id: 'enrollment', progress: 50, save });
 resourceFind.mockResolvedValue({ _id: 'resource', module: 'module' });
 moduleFind.mockResolvedValue({ _id: 'module', course: 'course', order: 1 });
 moduleList.mockImplementation(async (query) => query.order ? [] : [{ _id: 'module' }]);
 resourceList.mockResolvedValue([{ _id: 'resource' }]);
 upsert.mockResolvedValue({ lastErrorObject: { updatedExisting: false }, value: {} });
 count.mockResolvedValue(1); transition.mockResolvedValue({ progress: 100 }); courseFind.mockResolvedValue({ title: 'Node.js' });
});
afterEach(() => jest.restoreAllMocks());
it('sends after atomic transition and suppresses repeated completion', async () => {
 sendCourseCompletedEmail.mockImplementation(async () => { expect(transition).toHaveBeenCalledTimes(1); });
 expect((await complete()).status).toBe(201);
 expect(transition).toHaveBeenCalledWith({ _id: 'enrollment', status: true, progress: { $lt: 100 } }, { $set: { progress: 100 } }, { new: true });
 expect(sendCourseCompletedEmail).toHaveBeenCalledWith({ to: 'learner@example.test', learnerName: 'Alice', courseTitle: 'Node.js' });
 transition.mockResolvedValue(null); upsert.mockResolvedValue({ lastErrorObject: { updatedExisting: true }, value: {} });
 expect((await complete()).status).toBe(200);
 expect(sendCourseCompletedEmail).toHaveBeenCalledTimes(1);
});
it('does not notify for partial progress', async () => {
 resourceList.mockResolvedValue([{ _id: 'first' }, { _id: 'second' }]);
 expect((await complete()).body.progress).toBe(50);
 expect(transition).toHaveBeenCalledWith({ _id: 'enrollment', status: true, progress: 50 }, { $set: { progress: 50 } }, { new: true });
 expect(sendCourseCompletedEmail).not.toHaveBeenCalled();
});
it.each(['email', 'lookup'])('keeps completion successful on notification failure: %s', async (failure) => {
 if (failure === 'email') sendCourseCompletedEmail.mockRejectedValue(new Error('secret'));
 else courseFind.mockRejectedValue(new Error('secret'));
 expect((await complete()).status).toBe(201);
 expect(JSON.stringify(console.error.mock.calls)).not.toContain('secret');
});
it.each(['resource', 'enrollment', 'upsert', 'transition'])('does not notify after business failure: %s', async (failure) => {
 if (failure === 'resource') resourceFind.mockResolvedValue(null);
 if (failure === 'enrollment') enrollmentFind.mockResolvedValue(null);
 if (failure === 'upsert') upsert.mockRejectedValue(new Error('Failed'));
 if (failure === 'transition') transition.mockRejectedValue(new Error('Failed'));
 expect((await complete()).status).toBe(failure === 'resource' ? 404 : failure === 'enrollment' ? 403 : 500);
 expect(sendCourseCompletedEmail).not.toHaveBeenCalled();
});
