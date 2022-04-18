export interface SendMessage {
  message: string;
  lstUserUid: string[];
}

export interface SentMessageFilter {
  isInbox: boolean;
  startFrom: string;
  sentFrom?: string[];
  sentTo?: string[];
  msg?: string;
}
