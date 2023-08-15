import config from "../config/config";
import { Response } from "express";
import { getUsers, getUsersCount } from "../util/dbUtils";
import { hasAdminAccess, hasWriteAccess } from "../util/authUtils"
import {queryParamsToFilter} from "../util/userFilterUtils"
import { createSyntheticData} from "../util/dbUtils";

//Router for processing requests for user data
//It's assumed that the user is already authenticated by upstream middleware/processes
//When interacting with this router

const express = require("express");
const router = express.Router();

let createdTestData = !config.initTestData;

router.get("/initTestData", async(req: any, res: Response) => {

    if(createdTestData)
    {
        //Failsafe to prevent multiple queries
        res.send({"Result":"Already set up database."});
        return;
    }

    createdTestData = true; //Update the "global" to indicate that we created or tried to create data.

    try 
    {
        createSyntheticData();
    } catch {
        console.log("Encountered an error setting up the database :(");
    }

    res.send({"Result":"Setting up database if required. Please wait."});
});

//Get a number of user records equal to the count, starting from the start index
router.get("/users", async (req: any, res: Response) => {

    let startIndex = req.query.startIndex;
    let count = req.query.count;

    if(!startIndex || !count)
    {
        res.status(400).send("Missing startIndex or count parameters");
        return;
    }

    if(startIndex < 0 || count < 0)
    {
        res.status(400).send("startIndex and count parameters cannot be negative");
        return;
    }

    try {
        let users = await getUsers(queryParamsToFilter(req.query),startIndex,count);
        res.send(users);
    } catch {
        res.status(500).send("Encountered an error getting users.");
    }
});

//Get a number of user records equal to the count, starting from the start index
router.get("/users/count", async (req: any, res: Response) => {

    try {
        let usersCount = await getUsersCount(queryParamsToFilter(req.query));
        res.send({"count":usersCount});
    } catch {
        res.status(500).send("Encountered an error getting user count.");
    }
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