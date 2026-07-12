import mongoose, { Schema } from 'mongoose';
import {
  IAccountDocument,
  IAddress,
  IDevice,
  IRecentlyViewed,
} from './types/Account_Schema.types.js';

const AddressSchema = new Schema<IAddress>(
  {
    tag: { type: String, enum: ['Home', 'Work', 'Other'], default: 'Home' },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, default: null },
    landmark: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pincode: { type: String, trim: true, required: true },
  },
  {
    timestamps: true,
    _id: true,
  },
);

const Device_Schema = new Schema<IDevice>(
  {
    name: { type: String, trim: true },
    location: { type: String, trim: true },
    lastUsed: { type: Date, default: Date.now },
    registeredOn: { type: Date, default: Date.now },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true },
);

const recently_Viewed_Schema = new Schema<IRecentlyViewed>(
  {
    link: {
      type: String,
      trim: true,
      derfault: '',
    },
    image: {
      type: String,
      trim: true,
      derfault: '',
    },
    name: {
      type: String,
      trim: true,
      derfault: '',
    },
  },
  { timestamps: true },
);

const Account_Schema = new Schema<IAccountDocument>(
  {
    avtar: {
      type: String,
      default: '',
      trim: true,
    },
    fullname: {
      type: String,
      lowercase: true,
      trim: true,
      required: [true, 'please provide valid full name'],
    },
    email: {
      type: String,
      required: [true, 'email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        'Please provide a valid email address',
      ],
    },
    phone: {
      country_code: {
        type: String,
        enum: ['+91'],
        default: '+91',
      },
      number: {
        type: String,
        default: null,
        validate: {
          validator: function (v: string | null) {
            return v === null || /^\d{10}$/.test(v);
          },
          message: 'Please enter a valid 10-digit phone number',
        },
      },
    },
    otp: {
      type: String,
      default: '',
      trim: true,
    },
    otpExpiry: {
      type: Date,
      default: null,
    },
    savedAddress: [AddressSchema],
    archived: {
      type: Boolean,
      default: false,
    },
    blocked: {
      type: Boolean,
      default: false,
    },
    device: [Device_Schema],
    recentlyViewed: [recently_Viewed_Schema],
  },
  { timestamps: true },
);

export const Account = mongoose.model('Account', Account_Schema);
