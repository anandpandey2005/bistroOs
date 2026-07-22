import { z } from "zod";
import { Account } from "../../models/Account_Schema.models.js";
import { Request, Response } from "express";

const mobile_validation = z.object({
    counytry_code: z.string().trim().toLowerCase().length(3, "Please provide a valid country code."),
    number: z.string().trim().toLowerCase().length(10, "Please provide a valid phone number"),
    otp: z.string().trim().length(6, "Invalid otp.")
});

export async function update_mobile(req: Request, res: Response): Promise<void> {
    try {

        const user_id = req?.user?._id;
        if (!user_id) {
            res.status(400).json({ success: false, message: "ID missing." });
            return;
        }
        const validate_data = mobile_validation.parse(req?.body);

        const updatedUser = await Account.findOneAndUpdate(
            {
                _id: user_id,
                otp: validate_data.otp,
                otpExpiry: { $gt: new Date() }
            },
            {
                $set: { "phone.number": validate_data.number, "phone.countryCode": validate_data.counytry_code },
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
            message: "phone number updated successfully."
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