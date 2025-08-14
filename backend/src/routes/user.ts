import { Router, Request, Response } from "express";
import { StatusError } from "../lib/status-error.js";

const user = Router();

interface User {
  name: string;
  picture: string;
  email: string;
}

user.get("/user", (req: Request, res: Response) => {
  // @ts-ignore
  const sentUser: User = {
    name: req.oidc.user?.name,
    picture: req.oidc.user?.picture,
    email: req.oidc.user?.email,
    role: req.oidc.user["rbac/roles"],
  };
  res.json(sentUser);
});

export default user;
