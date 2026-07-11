import { Request, Response } from "express";
import { User } from "../../models/User_Schema.models.js";
import { ZodError } from "zod";
import { RegisterUserInputSchema } from "../../schemas/user.schema.js";

export async function user_signup(req: Request, res: Response): Promise<void> {
    try {
        const validatedData = RegisterUserInputSchema.parse(req.body);

        const existingUser = await User.findOne({ email: validatedData.email });
        if (existingUser) {
            res.status(409).json({
                success: false,
                message: "A user account with this email already exists"
            });
            return;
        }

        const user_data = new User({
            fullname: validatedData.fullname,
            email: validatedData.email,
            phone: validatedData.phone,
            address: validatedData.address,
        });

        await user_data.save();

        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: null,
        });

    } catch (error: unknown) {

        if (error instanceof ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: error.format()
            });
            return;
        }

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
    }
}