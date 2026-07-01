import mongoose, { Schema } from "mongoose";
import { IUserDocument } from './types/User_schema.models.js'
const AddressSchema = new Schema({
    tag: { type: String, enum: ["Home", "Work", "Other"], default: "Home" },
    line1: { type: String, trim: true, required: true },
    line2: { type: String, default: null },
    landmark: { type: String, trim: true, required: true },
    city: { type: String, trim: true, required: true },
    state: { type: String, trim: true, required: true },
    pincode: { type: String, trim: true, required: true }
}, {
    timestamps: true,
    _id: true
});

const User_Schema = new Schema<IUserDocument>({
    fullname: {
        type: String,
        lowercase: true,
        trim: true,
        required: [true, "please provide valid full name"],
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, "Please provide a valid email address"]
    },
    phone: {
        country_code: {
            type: String,
            enum: ["+91"],
            default: "+91",
        },
        number: {
            type: String,
            default: null,
            validate: {
                validator: function (v: string | null) {
                    return v === null || /^\d{10}$/.test(v);
                },
                message: "Please enter a valid 10-digit phone number"
            }
        }
    },
    address: [AddressSchema],

}, { timestamps: true });

export const User = mongoose.model("User", User_Schema);