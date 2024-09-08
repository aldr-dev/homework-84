import {Model, Schema} from 'mongoose';

export interface UserFields {
  username: string;
  password: string;
  token: string;
}

export interface TaskFields {
  user: Schema.Types.ObjectId;
  title: string;
  description: string;
  status: {
    enum: Array<string>;
    default: string;
  };
}

export interface UserMethods {
  checkPassword(password: string): Promise<boolean>;
  generateToken(): void;
}

export type UserModel = Model<UserFields, {}, UserMethods>;