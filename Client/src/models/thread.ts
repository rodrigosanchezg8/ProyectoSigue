import { Message } from "./message";

export class Thread {

  id?: number;
  subject: string;
  user_id_issuing: number;
  user_id_receiver: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  last_message: Message;

  messages: Message[] = [];
  notification: any;

  deserialize(object : Thread){
    Object.assign(this, object);
    return this;
  }

}
