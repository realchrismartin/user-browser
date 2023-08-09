type UserFilter = {
  FirstName: string,
  LastName: string,
  Degree: string,
  Company: string,
  Title: string,
  Email: string,
  Phone: string,
  FDACenter: string,
  FDADivision: string,
  PrincipalInvestigator: string,
  MainContact: string,
  NPI1Location: string,
  HPHCLogin: string
};

export function getBlankUserFilter() : UserFilter {

  return {
    FirstName:"",
    LastName:"",
    Degree:"",
    Company:"",
    Title:"",
    Email:"",
    Phone:"",
    FDACenter:"",
    FDADivision:"",
    PrincipalInvestigator:"",
    MainContact:"",
    NPI1Location:"",
    HPHCLogin:""
  }
}

export function filterToQueryParams(userFilter : UserFilter): Object {

  let values = {};
  
  //Unroll the userFilter into a series of values
  for (const [k, v] of Object.entries(userFilter))
  {
    if(v !== undefined && v !== "")
    {
      values = {...values,[k]:v}; //Include the key-value property in the values
    }
  }

  return values;

}

export default UserFilter;