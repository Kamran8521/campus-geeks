export const CAMPUS_EMAIL_DOMAIN =
  process.env.NEXT_PUBLIC_CAMPUS_EMAIL_DOMAIN ?? "uetpeshawar.edu.pk";

export const CAMPUS_NAME = process.env.NEXT_PUBLIC_CAMPUS_NAME ?? "UET Peshawar";

export function isCampusEmail(email: string) {
  return email.trim().toLowerCase().endsWith(`@${CAMPUS_EMAIL_DOMAIN}`);
}

export const CAMPUS_EMAIL_MESSAGE = `Use your ${CAMPUS_NAME} email (@${CAMPUS_EMAIL_DOMAIN}).`;
