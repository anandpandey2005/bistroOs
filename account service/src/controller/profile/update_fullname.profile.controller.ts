import { Request, Response } from "express";
import z from "zod";
import { Account } from "../../models/Account_Schema.models.js";

const name_validation = z.object({
    fullName: z.string().trim().length(4, "please enter your full name.")
});
export async function update_fullname(req: Request, res: Response): Promise<void> {
    try {
        const user_id = req?.user?._id;
        if (!user_id) {
            res.status(400).json({ success: false, message: "Id missing.", });
            return;
        }

        const validate_data = name_validation.parse(req?.body);

        const user = await Account.findByIdAndUpdate(user_id, {
            $set: { fullName: validate_data.fullName }
        }, { new: true })

        if (!user) throw Error("try again after some time");
        res.status(200).json({ success: true, message: "full name updated successfully," });
        return;

    } catch (error: unknown) {
        if (error instanceof z.ZodError) {
            res.status(500).json({ success: false, message: "validation failed.", error: error.format() });
            return;
        }
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message || "An system error occured." });
            return;
        }
        res.status(500).json({ success: false, message: "An system error occured." });
        return;
    }
}