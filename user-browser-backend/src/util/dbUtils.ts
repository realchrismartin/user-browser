import sql from "mssql";
import config from "../config/config"
import { ConnectionPool, IResult, PreparedStatement} from "mssql";
import { UserBrowserUser } from "../types/UserBrowserUser";
import UserFilter from "../types/UserFilter";
import { buildQueryForFilter,getPreparedValuesForFilter,initPreparedStatementForFilter } from "./userFilterUtils";

async function getUsersCount(userFilter: UserFilter): Promise<number> {

  return new Promise((resolve, reject) => {

    //Connect to the DB.
    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {

      //Set up a prepared statement based on the filter
      initPreparedStatementForFilter(userFilter,connectionPool).then((statement: PreparedStatement) => {

        //Build a query based on the filter
        buildQueryForFilter(userFilter,"SELECT COUNT(UserID) FROM Users as UserCount").then((query : string) => {

          //Print the query to the log
          console.log(query);

          //Prepare the statement using the query
          statement.prepare(query).then(() => {

            //Get the values for the prepared statement based on the filter
            getPreparedValuesForFilter(userFilter).then((preparedFilterValues: Object) => {

              //Print the params to the log
              debugPrintObject(preparedFilterValues);

              //Execute the PS
              statement.execute(preparedFilterValues).then((dbResult: IResult<any>) => {

                //Teardown!
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
    
    //Connect to the DB.
    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {

      //Set up a prepared statement based on the filter
      initPreparedStatementForFilter(userFilter,connectionPool).then((statement: PreparedStatement) => {

        //Prepare the statement to receive offset parms also.
        statement.input('offset', sql.Int)
        statement.input('limit', sql.Int)

        //Build a query based on the filter
        buildQueryForFilter(userFilter,"SELECT * FROM Users").then((query : string) => {

          //Add the offset and limit to the query
          query += " ORDER BY UserId OFFSET @offset ROWS FETCH NEXT @limit ROWS ONLY";

          //Print the query to the log
          console.log(query);

          //Prepare the statement using the query
          statement.prepare(query).then(() => {

            //Get the values for the prepared statement based on the filter
            getPreparedValuesForFilter(userFilter).then((preparedFilterValues: Object) => {

              //Add the offset and limit to the prepared values
              preparedFilterValues = {...preparedFilterValues,"offset":startIndex,"limit":count};

              //TODO
              debugPrintObject(preparedFilterValues);

              //Execute the PS
              statement.execute(preparedFilterValues).then((dbResult: IResult<any>) => {

                //Teardown!
                statement.unprepare().then(() => {

                  //Resolve the result.
                  //Record set may be empty! It's ok.
                  resolve(dbResult.recordset); 

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
      }).catch((err: any) => {
        reject(err);
      });
    }).catch((err: any) => {
      reject(err);
    });
  });
};

function debugPrintObject(obj:Object) :void 
{
    for (const [k, v] of Object.entries(obj))
    {
      console.log("      " + k + " -> " + v);
    }

    console.log("");
}

async function createSyntheticData(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    sql
      .connect(config.sql)
      .then((connectionPool: ConnectionPool) => {

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

        connectionPool.query(createTablesQuery).then((dbResult: IResult<any>) => {

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
            (12,'FirstName','LastName' ,'Degree','Company','Title','user12@email.com','1-1','Center','Division',0,'6' ,'6' ,'6')`;

            connectionPool.query(insertDataQuery).then((dbResult: IResult<any>) => {
                resolve(true);
              });
          }).catch((err: Error) => {
            //Query failed. Table probably exists.
            reject(err);
          });
      })
      .catch((err: Error) => {
        //Actual connection error
        reject(err);
      });
  })
}


export { getUsers, getUsersCount, createSyntheticData }