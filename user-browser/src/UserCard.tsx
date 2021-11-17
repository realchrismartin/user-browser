import UserBrowserUser from "./UserBrowserUser";

type UserCardProps = {
    user:UserBrowserUser
}

export default function UserCard(props:UserCardProps) {

    return(
        <div className="user-card">
            {props.user.email} | {props.user.company}
        </div>
    )
}