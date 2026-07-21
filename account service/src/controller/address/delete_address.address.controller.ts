import { Account } from '../../models/Account_Schema.models.js';
import { Request, Response } from 'express';

export async function delete_address(req: Request, res: Response): Promise<void> {
  try {
    const address_ids = req?.body || [];
    if (!address_ids || !Array.isArray(address_ids) || address_ids.length === 0) {
      res
        .status(400)
        .json({ success: false, message: 'We expect adrees that you wanna to delete.' });
      return;
    }
    const userId = req?.user?._id || {};
    if (!userId) {
      res.status(400).json({ success: false, message: 'id missing.' });
      return;
    }

    const result = await Account.updateOne(userId, {
      $pull: { savedAddress: { _id: { $in: address_ids } } },
    });
    if (result.matchedCount === 0) {
      res.status(404).json({ success: false, message: 'id missing' });
      return;
    } else if (result.modifiedCount === 0) {
      res.status(404).json({ success: false, message: 'Address not found or already deleted.' });
      return;
    } else {
      res.status(200).json({ success: true, message: 'Address deleted successfully.' });
      return;
    }
  } catch (error: unknown) {
    if (error instanceof Error) {
      res
        .status(500)
        .json({ success: false, message: error.message || 'An Unexpected system error occured' });
    }
    res.status(500).json({ success: false, message: 'An unexpeted system error occured.' });
    return;
  }
}
