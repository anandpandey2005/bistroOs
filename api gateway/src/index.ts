import env from 'dotenv';
env.config();
import app from './app.js';
import proxy from 'express-http-proxy';
import { verify_jsontoken } from './middleware/verifyig_jsonwebtoken.js';

//declaration
const port = process.env.PORT;
const auth_service = String(process.env.AUTH_SERVICE);
const menu_service = String(process.env.MENU_SERVICE);
const order_service = String(process.env.ORDER_SERVICE);

// middleware
app.use('/api/v1/auth', proxy(auth_service));
app.use('/api/v1/menu', proxy(menu_service));
app.use('/api/v1/order', verify_jsontoken, proxy(order_service));

//server start
app.listen(port, () => {
  console.log(`Running : http://localhost:${port}`);
});
