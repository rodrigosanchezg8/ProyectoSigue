
export class Message {

  id: number;
  body: string;
  thread_id: number;
  user_id_replier: number;
  user_id_receiver: number;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  class: string;
  base64_file: string;
  file_name: string;

  constructor(){}

  deserialize(object : Message){
    Object.assign(this, object);
    return this;
  }

  public setClass(id){
    this.class = this.user_id_replier === id  ? 'message sent' : 'message received';
    return this;
  }

}
