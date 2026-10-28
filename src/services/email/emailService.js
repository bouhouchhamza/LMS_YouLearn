import { renderEmailTemplate } from './emailTemplates.js';
import { sendLogEmail } from './transports/logTransport.js';
import { sendSmtpEmail } from './transports/smtpTransport.js';

const sendEmail = async (event, { to, ...data }) => {
  const transport = process.env.EMAIL_DRIVER === 'smtp' ? 'smtp' : 'log';
  try {
    const message = await renderEmailTemplate(event, data);
    return await (transport === 'smtp' ? sendSmtpEmail : sendLogEmail)({ to, ...message });
  } catch {
    console.error('Email notification failed');
    return { success: false, transport };
  }
};
export const sendWelcomeEmail = (data) => sendEmail('welcome', { platformName: 'YouLearn', ...data });
export const sendEnrollmentEmail = (data) => sendEmail('enrollment', data);
export const sendEnrollmentCancelledEmail = (data) => sendEmail('enrollmentCancelled', data);
export const sendCourseCompletedEmail = (data) => sendEmail('courseCompleted', data);
export const sendQuizPassedEmail = (data) => sendEmail('quizPassed', data);
export const sendQuizFailedEmail = (data) => sendEmail('quizFailed', data);
export const sendPasswordResetEmail = (data) => sendEmail('passwordReset', data);
export const sendCourseReminderEmail = (data) => sendEmail('courseReminder', data);
