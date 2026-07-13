import { Account } from '../../models/Account_Schema.models.js';
import { Request, Response } from 'express';

export async function logout_from_all_device(req: Request, res: Response): Promise<void> {
  try {
    const user_id = req?.user?._id;
    if (!user_id) {
      res.status(401).json({
        success: false,
        message: 'id missing',
      });
      return;
    }

    const updated_account = await Account.findByIdAndUpdate(
      user_id,
      {
        $set: {
          device: [],
        },
      },
      { new: true },
    );

    if (!updated_account) {
      throw Error('failed to logout acount');
    } else {
      res.status(200).json({ success: true, message: 'Successfully logout from all devices' });
      return;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ success: false, message: error.message || 'An enexpeccted system error occured.' });
      return;
    }

    res.status(500).json({ success: false, message: 'An enexpeccted system error occured.' });
    return;
  }
}
