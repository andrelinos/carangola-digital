export function getEmailCredentials() {
  const emailServer = process.env.RESEND_EMAIL_SERVER
  const emailFrom = process.env.RESEND_EMAIL_FROM

  return { emailServer, emailFrom }
}
