import fs from 'node:fs/promises';
import Handlebars from 'handlebars';

const definitions = {
  welcome: { subject: () => 'Bienvenue sur YouLearn', text: ({ fullName, platformName }) => `Bonjour ${fullName}, bienvenue sur ${platformName} !` },
  enrollment: { subject: ({ courseTitle }) => `Confirmation d'inscription -${courseTitle}`, text: ({ learnerName, courseTitle }) => `Bonjour ${learnerName}, votre inscription au cours ${courseTitle} est confirmée` },
  enrollmentCancelled: { subject: ({ courseTitle }) => `Inscription annulée — ${courseTitle}`, text: ({ learnerName, courseTitle }) => `Bonjour ${learnerName}, votre inscription au cours ${courseTitle} a été annulée.` },
  courseCompleted: { subject: ({ courseTitle }) => `Formation terminée — ${courseTitle}`, text: ({ learnerName, courseTitle }) => `Félicitations ${learnerName}, vous avez terminé le cours ${courseTitle} !` },
  quizPassed: { subject: ({ quizTitle }) => `Quiz réussi — ${quizTitle}`, text: ({ learnerName, quizTitle, score }) => `Félicitations ${learnerName}, vous avez réussi le quiz ${quizTitle}. Votre score : ${score}.` },
  quizFailed: { subject: ({ quizTitle }) => `Résultat du quiz — ${quizTitle}`, text: ({ learnerName, quizTitle, score }) => `Bonjour ${learnerName}, vous n'avez pas encore réussi le quiz ${quizTitle}. Votre score : ${score}. Poursuivez vos révisions !` },
  passwordReset: { subject: () => 'Réinitialisation de votre mot de passe', text: ({ fullName, resetUrl }) => `Bonjour ${fullName}, pour réinitialiser votre mot de passe : ${resetUrl}. Si vous n'êtes pas à l'origine de cette demande, ignorez ce message.` },
  courseReminder: { subject: ({ courseTitle }) => `Continuez votre formation — ${courseTitle}`, text: ({ learnerName, courseTitle }) => `Bonjour ${learnerName}, poursuivez votre apprentissage avec le cours ${courseTitle}.` },
};

export const renderEmailTemplate = async (event, data) => {
  if (!Object.hasOwn(definitions, event)) throw new Error('Unknown email template');
  if (event === 'passwordReset') {
    const url = new URL(data.resetUrl);
    if (url.protocol !== 'https:' || url.username || url.password) throw new Error('Invalid reset URL');
  }
  const source = await fs.readFile(new URL(`./templates/${event}.hbs`, import.meta.url), 'utf8');
  const definition = definitions[event];
  return { subject: definition.subject(data), text: definition.text(data), html: Handlebars.compile(source)(data) };
};

// Preserve the existing positional API.
export const enrollmentEmailTemplate = (learnerName, courseTitle) => renderEmailTemplate('enrollment', { learnerName, courseTitle });
export const welcomeEmailTemplate = (data) => renderEmailTemplate('welcome', { platformName: 'YouLearn', ...data });
export const enrollmentCancelledEmailTemplate = (data) => renderEmailTemplate('enrollmentCancelled', data);
export const courseCompletedEmailTemplate = (data) => renderEmailTemplate('courseCompleted', data);
export const quizPassedEmailTemplate = (data) => renderEmailTemplate('quizPassed', data);
export const quizFailedEmailTemplate = (data) => renderEmailTemplate('quizFailed', data);
export const passwordResetEmailTemplate = (data) => renderEmailTemplate('passwordReset', data);
export const courseReminderEmailTemplate = (data) => renderEmailTemplate('courseReminder', data);
