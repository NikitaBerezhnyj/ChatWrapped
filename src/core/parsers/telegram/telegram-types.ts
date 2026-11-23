export interface TelegramTextEntity {
  type: string;
  text: string;
}

export type TelegramText = string | Array<string | TelegramTextEntity> | null;

export interface TelegramMessage {
  id: number;
  type: string;
  date?: string;
  date_unixtime?: string;
  from?: string;
  from_id?: string;
  actor?: string;
  actor_id?: string;
  text?: TelegramText;
  reply_to_message_id?: number;
  media_type?: string;
  mime_type?: string;
  file_name?: string;
  duration_seconds?: number;
  file_size?: number;
  photo?: string;
  file?: string;
  sticker_emoji?: string;
  latitude?: number;
  longitude?: number;
}

export interface TelegramExport {
  type: string;
  id: number;
  name?: string;
  messages: TelegramMessage[];
}
