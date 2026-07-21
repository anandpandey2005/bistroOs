import { Account } from '../../models/Account_Schema.models.js';
import { Request, Response } from 'express';

export async function request_all_data(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?._id;

    if (!userId) {
      res.status(400).json({ success: false, message: 'User ID is missing.' });
      return;
    }

    const account = await Account.findById(userId).select('-otp -otpExpiry -deacticated -blocked');

    if (!account) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'your data that we are collected.',
      data: account,
    });
    return;
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ success: false, message: error.message || 'An unexpected system error occured.' });
      return;
    }
    res.status(500).json({ success: false, message: 'An unexpected system error occured.' });
    return;
  }
}
