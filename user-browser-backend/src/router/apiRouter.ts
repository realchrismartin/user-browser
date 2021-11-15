const express = require("express");
const sql = require("mssql");
const config = require("../config/config").default

const router = express.Router();

router.get("/data", (req : Request ,res : Response) => { 
    sql.connect(config.sqlConfig).then((connectionPool : any ) => {
        connectionPool.request("select * from test").then((dbResult : any) => {
            console.dir(dbResult);
        })
    }).catch((err : Error) => {
        console.log(err);
    });
});

module.exports = router;