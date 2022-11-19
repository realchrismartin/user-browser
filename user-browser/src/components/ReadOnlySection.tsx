import { useAppContext } from "../context/AppContext";

type SectionProps = {
    children : any;
};

//Section which is only displayed if a user has Read-only rights
export default function ReadOnlySection(props : SectionProps): React.ReactElement | null {
    const context = useAppContext();

    return((!context.hasWriteAccess && !context.hasAdminAccess) ? props.children : null);
}