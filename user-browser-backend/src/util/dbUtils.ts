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
        Phone varchar(12),
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
            (1,'Ulysses','Grant' ,'PhD','USA','President','ulysses.grant@email.com','800-999-9999','B','Operations',0,'6' ,'/test/' ,'ugrant'),
            (2,'Lucretia','Garfield' ,'PhD','USA','First Lady','lucretia.garfield@email.com','800-888-7777','A','Sales',0,'6' ,'/test2/' ,'lgrant'),
            (3,'Rosalyn','Carter' ,'Esq','USA','First Lady','rosalyn.carter@email.com','800-666-5555','C','Engineering',0,'6' ,'/test3/' ,'rcarter'),
            (4,'Jimmy','Carter' ,'MS','USA','President','jimmy.carter@email.com','800-222-3333','D','Operations',0,'6' ,'/test4/' ,'jcarter'),
            (5,'Grover','Cleveland' ,'PhD','USA','President','grover.cleveland@email.com','617-409-9999','A','Sales',0,'6' ,'/test5/' ,'gcleveland'),
            (6,'William','Harrison' ,'Esq','USA','President','william.harrison@email.com','123-345-4566','B','Engineering',0,'6' ,'/test6/' ,'wharrison'),
            (7,'Rose','Cleveland' ,'MS','USA','First Lady','rose.cleveland@email.com','123-234-3445','C','Operations',0,'6' ,'/test7/' ,'rcleveland'),
            (8,'Martha','Washington' ,'MFA','USA','First Lady','martha.washington@email.com','232-455-6643','D','Sales',0,'6' ,'/test8/' ,'mwashington'),
            (9,'George','Washington' ,'Esq','USA','President','george.washington@email.com','234-233-4444','A','Engineering',0,'6' ,'/test9/' ,'sjackson'),
            (10,'Letitia','Tyler' ,'PhD','USA','First Lady','letitia.tyler@email.com','999-999-9999','B','Operations',0,'6' ,'/test10/' ,'ltyler'),
            (11,'Jane','Harrison' ,'MFA','USA','First Lady','jane.harrison@email.com','123-234-2342','C','Sales',0,'6' ,'/test11/' ,'jharrison'),
            (12,'John','Tyler' ,'MFA','USA','President','john.tyler@email.com','989-232-1223','D','Engineering',0,'6' ,'/test12/' ,'jtyler')`;

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