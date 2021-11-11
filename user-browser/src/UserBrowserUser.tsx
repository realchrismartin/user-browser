import { User } from "microsoft-graph";

type UserBrowserUser = {
    displayName : String | undefined | null
    mail: String | undefined | null
}

export function getUserBrowserUserProperties() {
    return "displayName,mail"
}

export function getUserBrowserUserTableHeader() {
    return (
        <tr>
            <td>Display Name</td>
            <td>E-mail</td>
        </tr>
    )
}

export function getUserBrowserUserTableRow(user : UserBrowserUser) {
    return (
        <tr>
            <td>{user.displayName}</td>
            <td>{user.mail}</td>
        </tr>
    )
}

export function getUserBrowserUser(user : User) : UserBrowserUser {
    return { displayName: user.displayName, mail: user.mail }
}

export default UserBrowserUser;