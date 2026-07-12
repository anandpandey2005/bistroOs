import env from 'dotenv';
env.config();
import app from './app.js';
import mongoose from 'mongoose';

const port = process.env.PORT;

async function database_plug(): Promise<void> {
  try {
    const connection = await mongoose.connect(
      `${process.env.DATABASE_URI}/${process.env.DATABASE_NAME}`,
    );
    app.listen(port, () => console.log(`http://localhost:${port}`));
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error('Database Connection failed:', err.message);
    } else {
      console.error('An unexpected error occurred:', err);
    }

    process.exit(1);
  }
}

database_plug();
