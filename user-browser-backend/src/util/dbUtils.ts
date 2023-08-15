import sql from "mssql";
import config from "../config/config"
import { ConnectionPool, IResult, PreparedStatement} from "mssql";
import { UserBrowserUser } from "../types/UserBrowserUser";
import UserFilter from "../types/UserFilter";
import { buildQueryForFilter,getPreparedValuesForFilter,initPreparedStatementForFilter } from "./userFilterUtils";
import { firstNames,lastNames,degrees,titles,companies } from "../config/syntheticData";

async function getUsersCount(userFilter: UserFilter): Promise<number> {

  return new Promise((resolve, reject) => {

    //Connect to the DB.
    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {

      //Set up a prepared statement based on the filter
      initPreparedStatementForFilter(userFilter,connectionPool).then((statement: PreparedStatement) => {

        //Build a query based on the filter
        buildQueryForFilter(userFilter,"SELECT COUNT(UserID) FROM Users as UserCount").then((query : string) => {

          //Prepare the statement using the query
          statement.prepare(query).then(() => {

            //Get the values for the prepared statement based on the filter
            getPreparedValuesForFilter(userFilter).then((preparedFilterValues: Object) => {

              //Execute the PS
              statement.execute(preparedFilterValues).then((dbResult: IResult<any>) => {

                //Teardown!
                statement.unprepare().then(() => {

                  //Assumes the result is of a COUNT query.
                  const count = dbResult.recordset[0][""]

                  if(count == undefined)
                  {
                    reject("Something is wrong with this result!");
                  } else {
                    resolve(count); 
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

          //Prepare the statement using the query
          statement.prepare(query).then(() => {

            //Get the values for the prepared statement based on the filter
            getPreparedValuesForFilter(userFilter).then((preparedFilterValues: Object) => {

              //Add the offset and limit to the prepared values
              preparedFilterValues = {...preparedFilterValues,"offset":startIndex,"limit":count};

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

async function tablesExist(): Promise<boolean> {

  return new Promise((resolve, reject) => {

    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {

      const checkUserTableExistsQuery = "SELECT TOP 1 FROM dbo.Users";

        connectionPool.query(checkUserTableExistsQuery).then((dbResult: IResult<any>) => {
          resolve(true);
        }).catch((err : any) => { 
            console.log("Select query to test if Users table exist failed. Table might not exist.");
            resolve(false);
         });
    }).catch((err : any) => { 
      console.log("Database connection failed. Table check failed.");
      reject(false);
    });
  });
};

async function createSyntheticData(): Promise<boolean> {
  return new Promise((resolve, reject) => {
    sql.connect(config.sql).then((connectionPool: ConnectionPool) => {

      const createTablesQuery = `CREATE TABLE Users (
        UserID int PRIMARY KEY IDENTITY(1,1),
        FirstName varchar(100),
        LastName varchar(100),
        Degree varchar(100),
        Company varchar(100),
        Title varchar(50),
        Email varchar(100),
        Phone varchar(12),
        FDACenter varchar(50),
        FDADivision varchar(50),
        PrincipalInvestigator bit,
        MainContact varchar(50),
        NPI1Location varchar(50),
        HPHCLogin varchar(50));`;

        let queryCount = 125;
        let userCount = 1000;

        let currentCount = 0; //Inserted count
        let totalCount = queryCount * userCount;

        connectionPool.query(createTablesQuery).then((dbResult: IResult<any>) => {

          const queryPromises = Array.from({ length: queryCount }, () =>{
            new Promise((res, rej) => {
              buildSyntheticData(userCount).then((query : string ) => {
                connectionPool.query(query).then((dbResult : any) => {
                  currentCount += userCount;
                  let percentComplete = 100 * (currentCount / totalCount);
                  console.log("> Inserted " + currentCount + "/" + totalCount + " users (" + percentComplete + "% complete)");
                  res(true);
                }).catch((err : any) => { rej(err); });
              }).catch((err : any) => { rej(err); });
            });
          });

          Promise.all(queryPromises).then((result : void[]) => {
           resolve(true);
          }).catch((err: Error) => {
            reject(err);
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

async function buildSyntheticData(userCount : number): Promise<string> {

  return new Promise((resolve, reject) => {

  let query = `INSERT INTO [dbo].[Users]([FirstName],[LastName],[Degree],[Company],[Title],[Email],[Phone],[FDACenter] ,[FDADivision] ,[PrincipalInvestigator] ,[MainContact] ,[NPI1Location] ,[HPHCLogin]) VALUES `   

    for(let i = 0; i < userCount; i++)
    {
      let lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      let firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      let degree = degrees[Math.floor(Math.random() * degrees.length)];
      let company = companies[Math.floor(Math.random() * companies.length)];
      let title = titles[Math.floor(Math.random() * titles.length)];

      query += ` ('${firstName}','${lastName}','${degree}','${company}','${title}','${firstName}.${lastName}@email.com','800-999-9999','B','Operations',0,'6' ,'/test/' ,'uname'),`
    }

    query = query.slice(0,-1);

  resolve(query);

  });

}

export { getUsers, getUsersCount, tablesExist, createSyntheticData }