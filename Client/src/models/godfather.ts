export class Godfather {

  id: number;
  first_name: string;
  last_name: string;
  full_name: string;
  phone: string;
  password: string;
  email: string;
  interests: string;
  profile_image: string;


  deserialize(object : Godfather){
    Object.assign(this, object);
    return this;
  }

}
