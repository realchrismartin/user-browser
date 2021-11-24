import { Response } from "express";
import { User } from "../types/User";
import { getUsers } from "../util/dbUtils";
import { hasWriteAccess, hasAdminAccess } from "../util/authUtils";

const express = require("express");
const router = express.Router();

router.get("/data", (req : any ,res : Response) => { 

    getUsers().then((users : User[]) => {
        res.send(users)
    })
});

module.exports = router;