import { z } from "zod";
import { Account } from "../../models/Account_Schema.models.js";
import { Request, Response } from "express";

const email_validation = z.object({
    email: z.string().trim().toLowerCase().email("Please provide a valid email address"),
    otp: z.string().trim().length(6, "Invalid otp.")
});

export async function update_email(req: Request, res: Response): Promise<void> {
    try {

        const user_id = req?.user?._id;
        if (!user_id) {
            res.status(400).json({ success: false, message: "ID missing." });
            return;
        }
        const validate_data = email_validation.parse(req?.body);

        const updatedUser = await Account.findOneAndUpdate(
            {
                _id: user_id,
                otp: validate_data.otp,
                otpExpiry: { $gt: new Date() }
            },
            {
                $set: { email: validate_data.email },
                $unset: { otp: "", otpExpiry: "" }
            },
            { new: true }
        );

        if (!updatedUser) {
            res.status(400).json({ success: false, message: "Invalid or expired OTP." });
            return;
        }

        res.status(200).json({
            success: true,
            message: "Email updated successfully."
        });

        return;

    } catch (error: unknown) {

        if (error instanceof z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Validation error.",
                error: error.format(),
            });
            return;
        }

        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message || "A system error occurred." });
            return;
        }

        res.status(500).json({ success: false, message: "A system error occurred." });
    }
}