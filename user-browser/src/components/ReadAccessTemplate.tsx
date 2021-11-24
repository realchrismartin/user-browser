import { useAppContext } from "../context/AppContext";

type ReadAccessTemplateProps = {
    children: any;
};

export default function ReadAccessTemplate(props : ReadAccessTemplateProps) {
    const app = useAppContext();

    return((!app.hasWriteAccess && !app.hasAdminAccess) ? (<div>{props.children}</div>) : (<div></div>));
}