import { User } from "../types/User";
import { ConnectionPool, IResult } from "mssql";

const config = require("../config/config").default;
const sql = require("mssql");

async function getUsers(): Promise<User[]> {
  return new Promise((resolve, reject) => {
    sql
      .connect(config.sql)
      .then((connectionPool: ConnectionPool) => {
        connectionPool
          .query(config.sql.usersQuery)
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