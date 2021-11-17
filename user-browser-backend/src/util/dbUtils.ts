import { SalesQuoteLine } from "@microsoft/microsoft-graph-types-beta";
import { User } from "../types/User";
import { ConnectionPool, IResult } from "mssql";

const config = require("../config/config").default;
const sql = require("mssql");

async function getUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    sql
      .connect(config.sqlConfig)
      .then((connectionPool: ConnectionPool) => {
        connectionPool
          .query(config.sqlConfig.usersQuery)
          .then((dbResult: IResult<any>) => {
            resolve(dbResult.recordset);
          });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

export { getUsers }