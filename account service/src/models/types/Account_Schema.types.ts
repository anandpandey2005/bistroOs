import { Document, Types } from 'mongoose';

export interface IAddress {
  _id?: Types.ObjectId;
  tag: 'Home' | 'Work' | 'Other';
  line1: string;
  line2?: string | null;
  landmark: string;
  city: string;
  state: string;
  pincode: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IDevice {
  _id?: Types.ObjectId | null;
  name?: string | '';
  location?: string | '';
  lastUsed?: Date | null;
  registeredOn?: Date | null;
  sessionId?: string | '';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IRecentlyViewed {
  _id?: Types.ObjectId;
  link: string;
  name: string;
  image: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccount {
  avtar: string;
  fullname: string;
  email: string;
  phone?: {
    country_code: '+91';
    number: string | null;
  };
  otp: string;
  otpExpiry: Date;
  savedAddress?: IAddress[];
  device?: IDevice[];
  recentlyViewed?: IRecentlyViewed[];
  archived?: boolean;
  blocked?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IAccountDocument extends IAccount, Document {
  _id: Types.ObjectId;
}
