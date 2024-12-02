import express, { Request, Response } from 'express';

import { authenticateToken } from '../framework/middleWares/tokenValidator';

export const blogRouter = express.Router();