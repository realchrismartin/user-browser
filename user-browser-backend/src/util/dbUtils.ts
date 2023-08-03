import { UserBrowserUser } from "../types/UserBrowserUser";
import { UserFilter } from "../types/UserFilter";
import { ConnectionPool, IResult, PreparedStatement, PreparedStatementError } from "mssql";

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
          }).catch((err: Error) => {
            //Query failed. Table exists
            reject(err);
          });
      })
      .catch((err: Error) => {
        //Actual connection error
        reject(err);
      });
  })
}

async function getUsersCount(userFilter:UserFilter): Promise<number> {
    
  //TODO: user filter properties to make query
    return new Promise((resolve, reject) => {
      sql
        .connect(config.sql)
        .then((connectionPool: ConnectionPool) => {
          connectionPool
            .query(config.sql.getUserCountQuery)
            .then((dbResult: IResult<any>) => {
                resolve(parseInt(dbResult.recordset[0][""]));
            });
        })
        .catch((err: Error) => {
          reject(err);
        });
    });
}

async function getUsers(userFilter:UserFilter,startIndex:number,count:number): Promise<UserBrowserUser[]> {

  //TODO: user filter properties to make query

    return new Promise((resolve, reject) => {
      sql
        .connect(config.sql)
        .then((connectionPool: ConnectionPool) => {

          //Build a prepared statement
          const statement = new sql.PreparedStatement(connectionPool)
          statement.input('limit', sql.Int)
          statement.input('offset', sql.Int)

          statement.prepare(config.sql.getUsersNoFilterQuery).then(()=>{
            statement.execute({limit: count,offset:startIndex}).then((dbResult:IResult<any>) =>{
              statement.unprepare().then(()=>{
                //Resolve the final result.
                console.log(dbResult.recordset);
                resolve(dbResult.recordset);
              }).catch((err : any)=> {console.log(err);});
            }).catch((err : any)=> {console.log(err);});
          }).catch((err : any)=> {console.log(err);});
        }).catch((err : any)=> {console.log(err);});
  });
};

export { getUsers, getUsersCount, createSyntheticData }