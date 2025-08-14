import { Request, Response, NextFunction } from "express";
import { StatusError } from "../lib/status-error.ts";

export function notFound(req: Request, res: Response, next: NextFunction) {
  return next(new StatusError("Site Not Found", 404));
}
