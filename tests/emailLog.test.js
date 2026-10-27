import { jest, it, expect } from '@jest/globals';
import { sendLogEmail } from '../src/services/email/transports/logTransport.js';
it('simulates delivery without logging the recipient or message content', async () => {
  const log = jest.spyOn(console, 'log').mockImplementation(() => {});
  try {
    expect(await sendLogEmail({ to: 'private@example.test', subject: 'private subject', text: 'secret-token' })).toEqual({ success: true, transport: 'log' });
    expect(log).toHaveBeenCalledWith('Email simulated');
    expect(JSON.stringify(log.mock.calls)).not.toMatch(/private|secret-token/);
  } finally { log.mockRestore(); }
});
