import { add_new_address } from '../controller/address/add_new_address.address.controller.js';
import express, { Router } from 'express';

const address_router: Router = express.Router();

address_router.post('/', add_new_address);

export default address_router;
