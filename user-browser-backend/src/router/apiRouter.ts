import { Request, Response } from "express";
import cors from "../config/cors";
import { User } from "../types/User";
import { getUsers } from "../util/dbUtils";

const express = require("express");
const router = express.Router();

router.get("/data", (req : any ,res : Response) => { 
    //TODO: make auth decisions based on group membership
    //console.log(req.user.groups)
    getUsers().then((users : User[]) => {
        res.send(users)
    })
});

module.exports = router;