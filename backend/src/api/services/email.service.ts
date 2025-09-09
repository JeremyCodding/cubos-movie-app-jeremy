import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendWelcomeEmail = async (name: string, email: string) => {
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // You must verify a domain in Resend to use your own email
      to: email,
      subject: 'Welcome to the Cubos Movie App!',
      html: `<h1>Hi ${name},</h1><p>Thank you for registering. We're excited to have you!</p>`,
    });
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    // Note: It's often best not to throw an error here to avoid
    // failing the entire registration process if the email fails.
  }
};

export const sendPasswordResetEmail = async (email: string, resetToken: string) => {
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;

    try {
        await resend.emails.send({
            from: 'security@resend.dev',
            to: email,
            subject: 'Your Password Reset Link',
            html: `<p>Please click the following link to reset your password:</p><a href="${resetLink}">Reset Password</a><p>This link will expire in 1 hour.</p>`,
        });
    } catch (error) {
        console.error('Failed to send password reset email:', error);
        throw new Error('Could not send password reset email.');
    }
};

export const sendPremiereReminderEmail = async (userEmail: string, movieTitle: string) => {
  const subject = `Lembrete de Estreia: "${movieTitle}" é hoje!`;
  const body = `
    <h1>Olá!</h1>
    <p>Este é um lembrete de que o filme "<strong>${movieTitle}</strong>", que você cadastrou, estreia hoje!</p>
    <p>Aproveite para assistir!</p>
  `;

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: userEmail,
      subject: subject,
      html: body,
    });
    console.log(`Premiere reminder email sent to ${userEmail} for movie "${movieTitle}"`);
  } catch (error) {
    console.error(`Failed to send premiere reminder email to ${userEmail}:`, error);
  }
};