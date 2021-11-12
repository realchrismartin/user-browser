import { User } from "microsoft-graph";

type UserBrowserUser = {
    displayName : String | undefined | null
    mail: String | undefined | null
}

export function getUserBrowserUser(user : User) : UserBrowserUser {
    return { displayName: user.displayName, mail: user.mail }
}

export default UserBrowserUser;