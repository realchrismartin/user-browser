import { Request, Response } from "express";
import { User } from "../types/User";
import { getUsers } from "../util/dbUtils";

const express = require("express");
const router = express.Router();

router.get("/data", (req : Request ,res : Response) => { 
    getUsers().then((users : User[]) => {
        res.send(users)
    })
});

module.exports = router;