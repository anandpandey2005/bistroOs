import { Document, Types } from "mongoose";

export interface IAddress {
    _id?: Types.ObjectId;
    tag: "Home" | "Work" | "Other";
    line1: string;
    line2?: string | null;
    landmark: string;
    city: string;
    state: string;
    pincode: string;
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUser {
    fullname: string;
    email: string;
    phone?: {
        country_code: "+91";
        number: string | null;
    };
    address?: IAddress[];
    createdAt?: Date;
    updatedAt?: Date;
}

export interface IUserDocument extends IUser, Document {
    _id: Types.ObjectId;
}