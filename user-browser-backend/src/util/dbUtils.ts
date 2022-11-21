import { UserBrowserUser } from "../types/UserBrowserUser";
import { ConnectionPool, IResult } from "mssql";

const config = require("../config/config").default;
const sql = require("mssql");

async function createSyntheticData(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    sql
      .connect(config.sql)
      .then((connectionPool: ConnectionPool) => {
        connectionPool
          .query(config.sql.createTableQuery)
          .then((dbResult: IResult<any>) => {
            connectionPool
            .query(config.sql.createFakeDataQuery)
            .then((dbResult: IResult<any>) => {
              resolve(true);
            });
          });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });
}

async function getUsers(startIndex:number,count:number): Promise<UserBrowserUser[]> {

  //TODO: respect pagination
  //Right now this just returns a set number of users
    return new Promise((resolve, reject) => {
      sql
        .connect(config.sql)
        .then((connectionPool: ConnectionPool) => {
          connectionPool
            .query(config.sql.getUsersQuery)
            .then((dbResult: IResult<any>) => {
                resolve(dbResult.recordset);
            });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
  }

export { getUsers, createSyntheticData }