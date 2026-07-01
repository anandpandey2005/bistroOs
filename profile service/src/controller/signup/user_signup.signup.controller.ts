import { Request, Response } from "express";
import { User } from "../../models/User_Schema.models.js";

export async function user_signup(req: Request, res: Response): Promise<void> {
    const userPayload = req?.body || {};

    if (
        Object.keys(userPayload).length === 0 ||
        !userPayload.fullname?.trim() ||
        !userPayload.email?.trim()
    ) {
        res.status(400).json({ success: false, message: "Bad request: fullname and email are required fields" });
        return;
    }

    try {
        const emailLower = userPayload.email.toLowerCase();
        const existingUser = await User.findOne({ email: emailLower });

        if (existingUser) {
            res.status(409).json({ success: false, message: "A user account with this email already exists" });
            return;
        }

        const user_data = new User({
            fullname: userPayload.fullname.trim(),
            email: emailLower,
            address: userPayload.address,
        });

        await user_data.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: null,
        });

    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
            return;
        }

        res.status(500).json({
            success: false,
            message: "An unexpected system error occurred."
        });
        return;
    }
}