import { Request, Response, NextFunction } from 'express';

const logger = (req: Request, res: Response, next: NextFunction): void => {
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${req.method} ${req.originalUrl}`);
  next();
};

export default logger;