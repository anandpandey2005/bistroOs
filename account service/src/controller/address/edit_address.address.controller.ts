import z from "zod";
import { Account } from "../../models/Account_Schema.models.js";
import { Request, Response } from "express";
import mongoose from "mongoose";

const input_validation = z.object({
    address_id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
        message: "Invalid Address ID format",
    }),
    tag: z.string().min(1).max(20).default("Home").optional(),
    line1: z.string().trim().min(1, 'Line 1 is required').optional(),
    line2: z.string().nullable().default(null).optional(),
    landmark: z.string().trim().min(1, 'Landmark is required').optional(),
    city: z.string().trim().min(1, 'City is required').optional(),
    state: z.string().trim().min(1, 'State is required').optional(),
    pincode: z.string().trim().min(1, 'Pincode is required').optional(),
});

export async function update_address(req: Request, res: Response): Promise<void> {
    try {
        const validate_data = input_validation.parse(req.body);
        const { address_id, ...rest } = validate_data;
        const user_id = req.user?._id;

        const update_fields: any = {};
        for (const [key, value] of Object.entries(rest)) {
            if (value !== undefined) update_fields[key] = value;
        }

        if (Object.keys(update_fields).length === 0) {
            res.status(400).json({ success: false, message: "No fields to update." });
            return;
        }

        const objectId = new mongoose.Types.ObjectId(address_id);

        const result = await Account.updateOne(
            { _id: user_id, "saved_address._id": objectId },
            { $set: { "saved_address.$": { ...update_fields, _id: objectId } } }
        );

        if (result.matchedCount === 0) {
            res.status(404).json({ success: false, message: "Address not found." });
            return;
        }

        res.status(200).json({ success: true, message: "Address updated successfully." });
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            res.status(400).json({ success: false, errors: error.format() });
        } else {
            console.error("Critical Update Error:", error);
            res.status(500).json({ success: false, message: "An unexpected sytem error occured." });
        }
    }
}