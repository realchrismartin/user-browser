import { Response } from "express";
import { getUsers } from "../util/dbUtils";
import { hasAdminAccess, hasWriteAccess } from "../util/authUtils"

//Router for processing requests for user data
//It's assumed that the user is already authenticated by upstream middleware/processes
//When interacting with this router

const express = require("express");
const router = express.Router();

//Get a number of user records.
//TODO: This endpoint needs to be paginated.
router.get("/users", async (req: any, res: Response) => {

    //TODO: add error handling
    //let users = await getUsers();
    let users = [{user:"test"}];

    res.send(users);
});

//Update a user record.
//TODO: this endpoint is incomplete
router.put("/users", (req: any, res: Response) => {

    if ((!hasWriteAccess(req.user)) && (!hasAdminAccess(req.user))) {
        //TODO: this will always occur because req.user doesn't have a group property yet
        res.status(403);
        res.send();
        return;
    }

    //TODO: check parameters, do database update
    res.send({ response: "TODO" }); //TODO
});

module.exports = router;