type UserFilter = {
  FirstName: string,
  LastName: string,
  Degree: string,
  Company: string,
  Title: string,
  Email: string,
  Phone: string,
  Center: string,
  Division: string,
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
    Center:"",
    Division:"",
    PrincipalInvestigator:"",
    MainContact:"",
    NPI1Location:"",
    HPHCLogin:""
  }
}

export function updateFilterWithValue(userFilter: UserFilter, key : string, value : string) : UserFilter
{
  switch(key)
  {
    case("FirstName"):
    {
      userFilter.FirstName = value;
      break;
    }
    case("LastName"):
    {
      userFilter.LastName = value;
      break;
    }
    case("Degree"):
    {
      userFilter.Degree = value;
      break;
    }
    case("Company"):
    {
      userFilter.Company = value;
      break;
    }
    case("Title"):
    {
      userFilter.Title = value;
      break;
    }
    case("Email"):
    {
      userFilter.Email = value;
      break;
    }
    case("Phone"):
    {
      userFilter.Phone = value;
      break;
    }
    case("Center"):
    {
      userFilter.Center = value;
      break;
    }
    case("Division"):
    {
      userFilter.Division = value;
      break;
    }
    case("PrincipalInvestigator"):
    {
      userFilter.PrincipalInvestigator = value;
      break;
    }
    case("MainContact"):
    {
      userFilter.MainContact = value;
      break;
    }
    case("NPI1Location"):
    {
      userFilter.NPI1Location = value;
      break;
    }
    case("HPHCLogin"):
    {
      userFilter.HPHCLogin = value;
      break;
    }
  }

  return userFilter;
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