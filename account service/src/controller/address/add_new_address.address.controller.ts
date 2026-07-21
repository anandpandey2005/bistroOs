import { AddressInputSchema } from '../../schemas/user.schema.js';
import { Account } from '../../models/Account_Schema.models.js';
import { Request, Response } from 'express';
import { ZodError } from 'zod';

export async function add_new_address(req: Request, res: Response): Promise<void> {
  try {
    const validatedData = AddressInputSchema.parse(req?.body);
    console.log(validatedData);
    // const user_id = req?.user?._id || req.headers.authorization?.split(' ')[1];
    const user_id = req?.user?._id || {};
    if (!user_id) {
      res.status(400).json({ success: false, message: 'id missing' });
      return;
    }

    const acknowledgement = await Account.findByIdAndUpdate(
      user_id,
      {
        $push: { savedAddress: validatedData },
      },
      { new: true },
    );

    if (!acknowledgement) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    const addresses = acknowledgement.savedAddress || [];

    const lastEntry = addresses[addresses.length - 1];
    const isMatch =
      lastEntry &&
      lastEntry.line1 === validatedData.line1 &&
      lastEntry.pincode === validatedData.pincode;

    if (isMatch) {
      res.status(200).json({
        success: true,
        message: 'Address added successfully',
        addressCount: addresses.length,
        data: lastEntry,
      });
      return;
    } else {
      throw Error('An unexpected system error occurred.');
    }
  } catch (error: unknown) {
    if (error instanceof ZodError) {
      res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: error.format(),
      });
      return;
    }
    res.status(500).json({ success: false, message: 'An unexpected system error occurred.' });
    return;
  }
}
