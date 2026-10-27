import { jest, it, expect, beforeEach, afterEach } from '@jest/globals';
const sendMail = jest.fn();
const createTransport = jest.fn(() => ({ sendMail }));
jest.unstable_mockModule('nodemailer', () => ({ default: { createTransport } }));
let sendSmtpEmail;
beforeEach(async () => {
  jest.resetModules();
  jest.clearAllMocks();
  jest.replaceProperty(process, 'env', { ...process.env, SMTP_HOST: 'smtp.example.test', SMTP_PORT: '587', SMTP_USER: 'fake-user', SMTP_PASS: 'fake-password', SMTP_FROM: 'sender@example.test' });
  ({ sendSmtpEmail } = await import('../src/services/email/transports/smtpTransport.js'));
});
afterEach(() => jest.restoreAllMocks());
it('lazily creates SMTP, reuses it and forwards the message', async () => {
  expect(createTransport).not.toHaveBeenCalled();
  sendMail.mockResolvedValue({ messageId: 'fake-id' });
  const message = { to: 'learner@example.test', subject: 'Subject', text: 'Text', html: '<p>Text</p>' };
  expect(await sendSmtpEmail(message)).toEqual({ success: true, transport: 'smtp', messageId: 'fake-id' });
  await sendSmtpEmail(message);
  expect(createTransport).toHaveBeenCalledTimes(1);
  expect(createTransport).toHaveBeenCalledWith({ host: 'smtp.example.test', port: 587, secure: false, requireTLS: true, auth: { user: 'fake-user', pass: 'fake-password' } });
  expect(sendMail).toHaveBeenCalledWith({ ...message, from: 'sender@example.test' });
});
it('uses implicit TLS on port 465', async () => {
  process.env.SMTP_PORT = '465';
  sendMail.mockResolvedValue({});
  await sendSmtpEmail({});
  expect(createTransport).toHaveBeenCalledWith(expect.objectContaining({ port: 465, secure: true }));
});
it('propagates mocked SMTP rejection to the service', async () => {
  sendMail.mockRejectedValue(new Error('SMTP unavailable'));
  await expect(sendSmtpEmail({})).rejects.toThrow('SMTP unavailable');
});
