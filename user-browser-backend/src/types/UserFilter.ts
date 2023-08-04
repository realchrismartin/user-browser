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
}

//Convert an object of query params to a valid UserFilter
function queryParamsToFilter(obj : any) : UserFilter
{
    //TODO: set filter properties
    let filter = {
        FirstName: obj["FirstName"] ? obj["FirstName"] : "",
        LastName: obj["LastName"] ? obj["LastName"] : "",
        Degree: "",
        Company: "",
        Title: "",
        Email: obj["Email"] ? "%" + obj["Email"] + "%" : "",
        Phone: "",
        FDACenter: "",
        FDADivision: "",
        MainContact: "",
        NPI1Location: "",
        PrincipalInvestigator:"",
        HPHCLogin: ""
    };

    return filter;
}

export {UserFilter, queryParamsToFilter}