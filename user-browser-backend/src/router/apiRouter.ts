import { Response } from "express";
import { getUsers } from "../util/dbUtils";
import { hasAdminAccess, hasWriteAccess } from "../util/authUtils"

const express = require("express");
const router = express.Router();

router.get("/users", async (req: any, res: Response) => {

    //TODO: add error handling
    let users = await getUsers();
    res.send(users);
    
});

router.put("/users", (req: any, res: Response) => {

    if ((!hasWriteAccess(req.user)) && (!hasAdminAccess(req.user))) {
        res.status(403);
        res.send();
        return;
    }

    //TODO: check parameters, do database update
    res.send({ response: "TODO" }); //TODO
});

module.exports = router;