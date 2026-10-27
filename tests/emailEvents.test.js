import { jest, it, expect, afterEach } from '@jest/globals';
import { renderEmailTemplate } from '../src/services/email/emailTemplates.js';
const sendLogEmail = jest.fn(async () => ({ success: true, transport: 'log' }));
const sendSmtpEmail = jest.fn();
jest.unstable_mockModule('../src/services/email/transports/logTransport.js', () => ({ sendLogEmail }));
jest.unstable_mockModule('../src/services/email/transports/smtpTransport.js', () => ({ sendSmtpEmail }));
const service = await import('../src/services/email/emailService.js');
const events = ['welcome', 'enrollment', 'enrollmentCancelled', 'courseCompleted', 'quizPassed', 'quizFailed', 'passwordReset', 'courseReminder'];
const data = { fullName: '<b>Alice</b>', platformName: '<b>Platform</b>', learnerName: '<b>Learner</b>', courseTitle: '<b>Course</b>', quizTitle: '<b>Quiz</b>', score: '<b>80</b>', resetUrl: 'https://example.test/reset?token=fake&next=%22' };
afterEach(() => { jest.restoreAllMocks(); jest.clearAllMocks(); });
it.each(events)('renders and escapes every variable: %s', async (event) => {
 const result = await renderEmailTemplate(event, data);
 expect(result.subject).toBeTruthy(); expect(result.text).toBeTruthy();
 expect(result.html).not.toContain('<b>');
 expect(result.html).toContain('&lt;b&gt;');
 expect(result.html).not.toMatch(/{{.*}}/);
 if (event === 'passwordReset') expect(result.html).toContain('&amp;next&#x3D;');
});
it.each(events)('supports log delivery: %s', async (event) => {
 jest.replaceProperty(process, 'env', { ...process.env, EMAIL_DRIVER: 'log' });
 const name = `send${event[0].toUpperCase()}${event.slice(1)}Email`;
 expect(await service[name]({ to: 'learner@example.test', ...data })).toEqual({ success: true, transport: 'log' });
 expect(sendLogEmail).toHaveBeenCalledTimes(1); expect(sendSmtpEmail).not.toHaveBeenCalled();
});
it.each(events)('contains mocked SMTP errors: %s', async (event) => {
 jest.replaceProperty(process, 'env', { ...process.env, EMAIL_DRIVER: 'smtp' });
 const log = jest.spyOn(console, 'error').mockImplementation(() => {});
 sendSmtpEmail.mockRejectedValue(new Error('private-token'));
 const name = `send${event[0].toUpperCase()}${event.slice(1)}Email`;
 expect(await service[name]({ to: 'learner@example.test', ...data })).toEqual({ success: false, transport: 'smtp' });
 expect(JSON.stringify(log.mock.calls)).not.toContain('private-token');
});
it.each(['javascript:alert(1)', 'data:text/html,test', 'http://example.test', 'https://user:pass@example.test', '/relative'])('rejects unsafe reset URL %s', async (resetUrl) => {
 await expect(renderEmailTemplate('passwordReset', { ...data, resetUrl })).rejects.toThrow();
});
it('rejects unknown template paths', async () => {
 await expect(renderEmailTemplate('../secret', data)).rejects.toThrow('Unknown email template');
});
