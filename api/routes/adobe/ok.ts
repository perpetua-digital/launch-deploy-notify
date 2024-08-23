import { Router, Request, Response } from 'express';

const router = Router();

// Define a route for getting all users
router.get('/', (req: Request, res: Response) => {
  res.send('Everything is ok in the adobe folder');
});

export default router;
