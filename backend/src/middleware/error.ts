import { Request, Response, NextFunction } from "express";
import { StatusError } from "../lib/status-error.ts";

export function error(
    err: StatusError,
    req: Request,
    res: Response,
    next: NextFunction
) {
    console.log("not found");
    try {
        const msg = JSON.parse(err.message);
        res.status(err.statusCode).json({ msg });
    } catch (error) {
        res.status(err.statusCode).json({ msg: err.message });
    }
}