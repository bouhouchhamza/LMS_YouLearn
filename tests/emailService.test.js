import { jest, describe, it, expect, beforeEach, afterEach } from '@jest/globals';
const sendLogEmail = jest.fn();
const sendSmtpEmail = jest.fn();
jest.unstable_mockModule('../src/services/email/transports/logTransport.js', () => ({ sendLogEmail }));
jest.unstable_mockModule('../src/services/email/transports/smtpTransport.js', () => ({ sendSmtpEmail }));
const { sendEnrollmentEmail } = await import('../src/services/email/emailService.js');
const payload = { to: 'learner@example.com', learnerName: 'Alice', courseTitle: 'Node.js' };
let log;
beforeEach(() => {
  jest.resetAllMocks();
  log = jest.spyOn(console, 'error').mockImplementation(() => {});
});
afterEach(() => { jest.restoreAllMocks(); });
describe('Email service', () => {
  it.each(['log', undefined])('uses log for %s', async (driver) => {
    jest.replaceProperty(process, 'env', { ...process.env, EMAIL_DRIVER: driver });
    sendLogEmail.mockResolvedValue({ success: true, transport: 'log' });
    expect(await sendEnrollmentEmail(payload)).toEqual({ success: true, transport: 'log' });
    expect(sendLogEmail).toHaveBeenCalledWith(expect.objectContaining({ to: payload.to, text: expect.stringContaining('Alice') }));
    expect(sendSmtpEmail).not.toHaveBeenCalled();
  });
  it('selects SMTP and passes rendered HTML', async () => {
    jest.replaceProperty(process, 'env', { ...process.env, EMAIL_DRIVER: 'smtp' });
    sendSmtpEmail.mockResolvedValue({ success: true, transport: 'smtp' });
    await sendEnrollmentEmail(payload);
    expect(sendSmtpEmail).toHaveBeenCalledWith(expect.objectContaining({ html: expect.stringContaining('Node.js'), to: payload.to }));
    expect(sendLogEmail).not.toHaveBeenCalled();
  });
  it('contains SMTP errors without logging sensitive details', async () => {
    jest.replaceProperty(process, 'env', { ...process.env, EMAIL_DRIVER: 'smtp' });
    sendSmtpEmail.mockRejectedValue(new Error('secret-token password recipient@example.com'));
    expect(await sendEnrollmentEmail(payload)).toEqual({ success: false, transport: 'smtp' });
    expect(log).toHaveBeenCalledWith('Email notification failed');
    expect(JSON.stringify(log.mock.calls)).not.toContain('secret-token');
  });
});
