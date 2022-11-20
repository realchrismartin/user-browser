type UserBrowserUser = {
    UserID: number,
    FirstName: string,
    LastName: string,
    Degree: string | undefined,
    Company: string | undefined,
    Title: string| undefined,
    Email: string,
    Phone: string |  undefined,
    FDACenter: string | undefined,
    FDADivision: string | undefined,
    PrincipalInvestigator: boolean | undefined,
    MainContact: string | undefined,
    NPI1Location: string | undefined,
    HPHCLogin: string | undefined,
}

export {UserBrowserUser}