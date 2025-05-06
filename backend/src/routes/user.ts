import { Router, Request, Response } from "express"

const user = Router();

interface User {
    name: string;
    picture: string;
    email: string;
};

user.get("/user", (
    req: Request,
    res: Response
) => {
    const sentUser: User = {
        name: req.oidc.user?.name,
        picture: req.oidc.user?.picture,
        email: req.oidc.user?.email,
    }
    res.json(sentUser);
});

export default user;