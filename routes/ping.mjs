import { Router } from "express";

const pingRouter = Router();

pingRouter.get("/", (req, res) => {
    res.json({ success: true });
});

export default pingRouter;
