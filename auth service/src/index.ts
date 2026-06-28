import env from 'dotenv';
env.config();
import app from './app.js';

const port = process.env.PORT || 0;

app.listen(port, () => {
  console.log(`http://localhost:${port}`);
});
