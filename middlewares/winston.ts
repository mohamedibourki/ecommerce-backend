import { Request, Response, NextFunction } from "express";
import logger from "../config/winston";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  logger.info(`${req.method} ${req.url}`);
  next();
};
