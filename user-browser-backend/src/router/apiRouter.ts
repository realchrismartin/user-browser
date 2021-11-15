import { Request, Response } from "express";
const express = require("express");
const sql = require("mssql");
const config = require("../config/config").default

const router = express.Router();

router.get("/data", (req : Request ,res : Response) => { 
    sql.connect(config.sqlConfig).then((connectionPool : any ) => {
        connectionPool.query("select * from users").then((dbResult : any) => {
            res.send(dbResult.recordset);
        })
    }).catch((err : Error) => {
        console.log(err);
    });
});

module.exports = router;