import 'server-only';

export type EmailMessage = {
  to: string;
  subject: string;
  text: string;
};

export interface EmailProvider {
  send(message: EmailMessage): Promise<void>;
}

export function getEmailProvider(): EmailProvider {
  throw new Error('No email provider configured. Add an SMTP/provider adapter before enabling email flows.');
}
