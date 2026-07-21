import { Account } from '../../models/Account_Schema.models.js';
import { Request, Response } from 'express';

export async function deactivate_account(req: Request, res: Response): Promise<void> {
  try {
    const userId = req?.user?._id || {};

    if (!userId) {
      res.status(400).json({ success: false, message: 'Id missing.' });
      return;
    }

    const acknowledgement = await Account.findByIdAndUpdate(
      userId,
      [
        {
          $set: {
            deactivated: { $not: '$deactivated' },
          },
        },
      ],
      { new: true },
    );

    if (!acknowledgement) {
      res.status(404).json({ success: false, message: 'user not found' });
      return;
    }
    res.status(200).json({ success: true, message: 'Account deactivated succesfully.' });
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
