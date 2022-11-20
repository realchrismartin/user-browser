import { UserBrowserUser } from "../types/UserBrowserUser";
import { ConnectionPool, IResult } from "mssql";

const config = require("../config/config").default;
const sql = require("mssql");

async function getUsers(startIndex:number,count:number): Promise<UserBrowserUser[]> {

  return new Promise((resolve, reject) => {

      //TODO: this is temporary data
      let users : UserBrowserUser[] = [];
      for(let i=0;i<count;i++)
      {
        let user =  {
          UserID: startIndex+i,
          FirstName: "User",
          LastName: "Name",
          Degree: "F",
          Company: "Company",
          Title: "Dr.",
          Email: startIndex+i+"user-contact-email@edu.edu",
          Phone:"1-800",
          FDACenter:"",
          FDADivision:"",
          PrincipalInvestigator:false,
          MainContact:"",
          HPHCLogin:"Missing",
          NPI1Location:"Missing"
        };

        users.push(user);
      }

      resolve(users);
  });

  //TODO
  /*
  return new Promise((resolve, reject) => {
    sql
      .connect(config.sql)
      .then((connectionPool: ConnectionPool) => {
        connectionPool
          .query(config.sql.usersQuery)
          .then((dbResult: IResult<any>) => {
            
            let users = dbResult.recordset;

            //TODO
            resolve(users);
          });
      })
      .catch((err: Error) => {
        reject(err);
      });
  });

  */
}

export { getUsers }