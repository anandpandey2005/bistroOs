import { Account } from "../../models/Account_Schema.models.js";
import { Request, Response } from "express";

export async function update_avataar(req: Request, res: Response) {
    try {


        const userId = req?.user?._id;



    } catch (error: unknown) {
        if (error instanceof Error) {
            res.status(500).json({ success: false, message: error.message || "Am system error occured." });
            return;
        }
        res.status(500).json({ success: false, message: "Am system error occured." });
        return;
    }

}


// i  hold this due to multer or cloudinay