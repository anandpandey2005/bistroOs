import { Account } from "../../models/Account_Schema.models.js";
import { Request, Response } from "express";

export async function get_initial_profile_data(req: Request, res: Response): Promise<void> {
    try {
        const user_id = req?.user?._id;
        if (!user_id) {
            res.status(400).json({ success: false, message: "Id missing." });
            return;
        }

        const user = await Account.findById(user_id).select("-_id -bloacked -deactivated -otp -otpExpiry");

        if (!user) {
            res.status(404).json({ success: false, message: "No record exists." });
            return;
        }

        res.status(200).json({ success: true, message: "records exists.", data: user });
        return;

    } catch (error: unknown) {

        if (error instanceof Error) {
            res.status(500).json({
                success: false, message: error.message || "An unexpected system error occured."
            });
            return;
        }
        res.status(500).json({
            success: false, message: "An unexpected system error occured."
        })
    }
}
