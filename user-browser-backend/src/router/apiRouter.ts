import { Response } from "express";
import { getUsers, getUsersCount } from "../util/dbUtils";
import { hasAdminAccess, hasWriteAccess } from "../util/authUtils"
import { start } from "repl";

//Router for processing requests for user data
//It's assumed that the user is already authenticated by upstream middleware/processes
//When interacting with this router

const express = require("express");
const router = express.Router();

//Get a number of user records equal to the count, starting from the start index
router.get("/users", async (req: any, res: Response) => {

    //TODO: add error handling
    let startIndex = req.query.startIndex;
    let count = req.query.count;

    //TODO: set filter properties

    let userFilter = {
        FirstName: "",
        LastName: "",
        Degree: "",
        Company: "",
        Title: "",
        Email: "",
        Phone: "",
        FDACenter: "",
        FDADivision: "",
        MainContact: "",
        NPI1Location: "",
        PrincipalInvestigator:"", //TODO: should be a boolean
        HPHCLogin: ""
    };

    let users = await getUsers(userFilter,startIndex,count);
    res.send(users);
});

//Get a number of user records equal to the count, starting from the start index
router.get("/users/count", async (req: any, res: Response) => {

    //TODO: add error handling
    let startIndex = req.query.startIndex;
    let count = req.query.count;

    //TODO: set filter properties
    let userFilter = {
        FirstName: "",
        LastName: "",
        Degree: "",
        Company: "",
        Title: "",
        Email: "",
        Phone: "",
        FDACenter: "",
        FDADivision: "",
        MainContact: "",
        NPI1Location: "",
        PrincipalInvestigator:"", //TODO: should be a boolean
        HPHCLogin: ""
    };

    let usersCount = await getUsersCount(userFilter);

    res.send({"count":usersCount});
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