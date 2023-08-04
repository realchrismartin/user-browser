import { UserBrowserUser } from "../types/UserBrowserUser";
import { UserFilter } from "../types/UserFilter";
import { ConnectionPool, IResult, PreparedStatement, PreparedStatementError } from "mssql";

const config = require("../config/config").default;
const sql = require("mssql");

async function createSyntheticData(): Promise<boolean> {
  return new Promise((resolve, reject) => {

    const createTablesQuery = `CREATE TABLE Users (
      UserID int,
      FirstName varchar(100),
      LastName varchar(100),
      Degree varchar(100),
      Company varchar(100),
      Title varchar(50),
      Email varchar(100),
      Phone varchar(10),
      FDACenter varchar(50),
      FDADivision varchar(50),
      PrincipalInvestigator bit,
      MainContact varchar(50),
      NPI1Location varchar(50),
      HPHCLogin varchar(50));`;

    const insertDataQuery = `
      INSERT INTO [dbo].[Users]([UserID],[FirstName],[LastName],[Degree],[Company],[Title],[Email],[Phone],[FDACenter] ,[FDADivision] ,[PrincipalInvestigator] ,[MainContact] ,[NPI1Location] ,[HPHCLogin])
      VALUES
      (1,'FirstName','LastName' ,'Degree','Company','Title','user1@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (2,'FirstName','LastName' ,'Degree','Company','Title','user2@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (3,'FirstName','LastName' ,'Degree','Company','Title','user3@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (4,'FirstName','LastName' ,'Degree','Company','Title','user4@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (5,'FirstName','LastName' ,'Degree','Company','Title','user5@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (6,'FirstName','LastName' ,'Degree','Company','Title','user6@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (7,'FirstName','LastName' ,'Degree','Company','Title','user7@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (8,'FirstName','LastName' ,'Degree','Company','Title','user8@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (9,'FirstName','LastName' ,'Degree','Company','Title','user9@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (10,'FirstName','LastName' ,'Degree','Company','Title','user10@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (11,'FirstName','LastName' ,'Degree','Company','Title','user11@email.com','1-1','Center','Division',0,'6' ,'6' ,'6'),
      (12,'FirstName','LastName' ,'Degree','Company','Title','user12@email.com','1-1','Center','Division',0,'6' ,'6' ,'6')
      `;

    sql
      .connect(config.sql)
      .then((connectionPool: ConnectionPool) => {
        connectionPool
          .query(createTablesQuery)
          .then((dbResult: IResult<any>) => {
            connectionPool
              .query(insertDataQuery)
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

//Get the count of users that match the specified filter from the DB
async function getUsersCount(userFilter: UserFilter): Promise<number> {

  return new Promise((resolve, reject) => {
    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {
      getPreparedUserCountQueryStatement(connectionPool, userFilter).then((statement: PreparedStatement) => {
        getPreparedUserCountQueryValues(userFilter).then((preparedValues: Object) => {

          debugPrintObject(preparedValues);

          statement.execute(preparedValues).then((dbResult: IResult<any>) => {
            statement.unprepare().then(() => {
              const count = dbResult.recordset[0][""]

              if(count == undefined)
              {
                reject("Something is wrong with this result!");
              } else {
                resolve(count); //Assumes the result is of a COUNT query.
              }

            }).catch((err: any) => {
              reject(err);
            });
          }).catch((err: any) => {
            reject(err);
          });
        }).catch((err: any) => {
          reject(err);
        });
      }).catch((err: any) => {
        reject(err);
      });
    }).catch((err: any) => {
      reject(err);
    });
  });
};

//Get user data for users which match the specified filter, starting at the start index, returning only "count" users
async function getUsers(userFilter: UserFilter, startIndex: number, count: number): Promise<UserBrowserUser[]> {

  return new Promise((resolve, reject) => {
    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {
      getPreparedUserQueryStatement(connectionPool, userFilter, startIndex, count).then((statement: PreparedStatement) => {
        getPreparedUserQueryValues(userFilter, startIndex, count).then((preparedValues: Object) => {

          //TODO
          debugPrintObject(preparedValues);

          statement.execute(preparedValues).then((dbResult: IResult<any>) => {
            statement.unprepare().then(() => {
              resolve(dbResult.recordset); //Record set may be empty! It's ok.
            }).catch((err: any) => {
              reject(err);
            });
          }).catch((err: any) => {
            reject(err);
          });
        }).catch((err: any) => {
          reject(err);
        });
      }).catch((err: any) => {
        reject(err);
      });
    }).catch((err: any) => {
      reject(err);
    });
  });
};

//Get a prepared statement for a given user query
async function getPreparedUserQueryStatement(connectionPool: ConnectionPool, userFilter: UserFilter, startIndex: number, count: number): Promise<PreparedStatement> {

  return new Promise((resolve, reject) => {

    const statement = new sql.PreparedStatement(connectionPool)

    //Set the base query
    let query = "SELECT * FROM dbo.Users";

    //Unroll the userFilter into a prepared statement
    for (const [k, v] of Object.entries(userFilter))
    {
      if(v !== undefined && v !== "")
      {
        statement.input(k, sql.VarChar(250)); //TODO: hardcoded size, assumes all user filter elements are strings
        query += " WHERE " + k + " LIKE @" + k + "";
      }
    }
   
    //Add offset clause to the query
    query += " ORDER BY UserId OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";

    //Prepare the statement to receive offset parms
    statement.input('offset', sql.Int)
    statement.input('limit', sql.Int)

    //TODO
    console.log("Prepared" + query);

    statement.prepare(query).then(() => {
      resolve(statement);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

//Get values for a prepared statement for a given users query
async function getPreparedUserQueryValues(userFilter: UserFilter, startIndex: number, count: number): Promise<Object> {

  return new Promise((resolve, reject) => {

    let values = {};

    //Unroll the userFilter into a series of values
    for (const [k, v] of Object.entries(userFilter))
    {
      if(v !== undefined && v !== "")
      {
        values = {...values,[k]:v}; //Include the key-value property in the values
      }
    }

    //Include the startIndex and offset parms, too
    values = {...values,"offset":startIndex,"limit":count};

    resolve(values);
  });
}

//Get a prepared statement for a given user count query
async function getPreparedUserCountQueryStatement(connectionPool: ConnectionPool, userFilter: UserFilter): Promise<PreparedStatement> {

  return new Promise((resolve, reject) => {

    const statement = new sql.PreparedStatement(connectionPool)

    //Set the base query
    let query = `SELECT COUNT(UserID) FROM Users as UserCount`;

    //Unroll the userFilter into a prepared statement
    for (const [k, v] of Object.entries(userFilter))
    {
      if(v !== undefined && v !== "")
      {
        statement.input(k, sql.VarChar(250)); //TODO: hardcoded size, assumes all user filter elements are strings
        query += " WHERE " + k + " LIKE @" + k + "";
      }
    }

    //TODO
    console.log("Prepared" + query);

    statement.prepare(query).then(() => {
      resolve(statement);
    }).catch((err: any) => {
      reject(err);
    });
  });
}

//Get values for a prepared statement for a given user count query
async function getPreparedUserCountQueryValues(userFilter: UserFilter): Promise<Object> {

  return new Promise((resolve, reject) => {

    let values = {};

    //Unroll the userFilter into a series of values
    for (const [k, v] of Object.entries(userFilter))
    {
      if(v !== undefined && v !== "")
      {
        values = {...values,[k]:v}; //Include the key-value property in the values
      }
    }

    resolve(values);
  });
}

function debugPrintObject(obj:Object) :void 
{
    console.log("====");
    for (const [k, v] of Object.entries(obj))
    {
      console.log(k + " -> " + v);
    }
    console.log("====");
    console.log("");
}

export { getUsers, getUsersCount, createSyntheticData }