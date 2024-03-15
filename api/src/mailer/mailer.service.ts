export interface MailerOptions {
  to: string[];
  from?: string;
  cc?: string[];
  bcc?: string[];
}

/**
 * Interface defining common API for sending emails.
 */
export interface MailerService {
  send(
    subject: string,
    htmlBody: string,
    options: MailerOptions,
  ): Promise<void>;
}

export const MailerService = Symbol('MailerService');
