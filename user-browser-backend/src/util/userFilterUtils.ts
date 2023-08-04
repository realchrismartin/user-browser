import sql, { ConnectionPool, PreparedStatement } from "mssql";
import UserFilter from "../types/UserFilter";

async function initPreparedStatementForFilter(userFilter : UserFilter,connectionPool:ConnectionPool) : Promise<PreparedStatement> {

  return new Promise((resolve, reject) => {
    
    //Make a new PS
    const statement = new sql.PreparedStatement(connectionPool);

    //Unroll the userFilter into a series of values
    for (const [k, v] of Object.entries(userFilter))
    {
      if(v !== undefined && v !== "")
      {
        statement.input(k,sql.VarChar); //NB: assumes all UserFilter fields are strings
      }
    }

    resolve(statement);
  });
}

async function buildQueryForFilter(userFilter: UserFilter, baseQuery : string) : Promise<string> {

  return new Promise((resolve, reject) => {

    let first = true;

    //Unroll the userFilter into a series of values
    for (const [k, v] of Object.entries(userFilter))
    {
      if(v !== undefined && v !== "")
      {
        baseQuery += ((first ? " WHERE " : " AND ") + k + " LIKE @" + k);
        first = false;
      }
    }

    resolve(baseQuery);
  });
}

async function getPreparedValuesForFilter(userFilter : UserFilter) : Promise<Object> {

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

//Convert an object of query params to a valid UserFilter
function queryParamsToFilter(obj : any) : UserFilter
{
    let filter = {
        FirstName: obj["FirstName"] ? "%" + obj["FirstName"] + "%" : "",
        LastName: obj["LastName"] ? "%" + obj["LastName"] + "%" : "",
        Degree: obj["Degree"] ? "%" + obj["Degree"] + "%" : "",
        Company: obj["Company"] ? "%" + obj["Company"] + "%" : "",
        Title: obj["Title"] ? "%" + obj["Title"] + "%" : "",
        Email: obj["Email"] ? "%" + obj["Email"] + "%" : "",
        Phone: obj["Phone"] ? "%" + obj["Phone"] + "%" : "",
        FDACenter: obj["FDACenter"] ? "%" + obj["FDACenter"] + "%" : "",
        FDADivision: obj["FDADivision"] ? "%" + obj["FDADivision"] + "%" : "",
        MainContact: obj["MainContact"] ? "%" + obj["MainContact"] + "%" : "",
        NPI1Location: obj["NPI1Location"] ? "%" + obj["NPI1Location"] + "%" : "",
        PrincipalInvestigator: obj["PrincipalInvestigator"] ? "%" + obj["PrincipalInvestigator"] + "%" : "",
        HPHCLogin: obj["HPHCLogin"] ? "%" + obj["HPHCLogin"] + "%" : ""
    };

    return filter;
}
export {initPreparedStatementForFilter,buildQueryForFilter,getPreparedValuesForFilter,queryParamsToFilter};
