import { useAppContext } from "../context/AppContext";

type WriteAccessTemplateProps = {
    children: any;
};

export default function WriteAccessTemplate(props : WriteAccessTemplateProps) {
    const app = useAppContext();

    return((app.hasWriteAccess || app.hasAdminAccess) ? (<div>{props.children}</div>) : (<div></div>));
}