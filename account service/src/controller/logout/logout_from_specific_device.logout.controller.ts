import { Account } from '../../models/Account_Schema.models.js';
import { Request, Response } from 'express';
export async function logout_from_specific_device(req: Request, res: Response): Promise<void> {
  try {
    const target_session_id = req?.body?.sessionIds || {};
    const user_id = req?.user?._id || {};
    const role = req?.user?.role || {};
    if (!user_id || !target_session_id || !role) {
      res
        .status(401)
        .json({
          success: false,
          message: 'validation failed , plese clear all your cache and then retry',
        });
      return;
    }

    const updated_account = await Account.findByIdAndUpdate(
      user_id,
      {
        $pull: {
          device: {
            sessionId: { $in: target_session_id },
          },
        },
      },
      { new: true },
    );

    if (!updated_account) {
      if (!updated_account) {
        res.status(404).json({ success: false, message: 'Account not found.' });
        return;
      }
    }

    const id_exists = updated_account?.device?.some((d) => d.sessionId === target_session_id);

    if (id_exists) {
      throw Error('failed to logout acount');
    } else {
      res.status(200).json({ success: true, message: 'succesfully logout the account' });
      return;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res.status(500).json({
        success: false,
        message: error.message || 'An unexpected system error occured.',
      });
      return;
    }

    res.status(500).json({ success: false, message: 'An unexpected system error occured.' });
    return;
  }
}
