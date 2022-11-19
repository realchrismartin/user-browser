import { useAppContext } from "../context/AppContext";

type ReadWriteSectionProps = {
    children: any;
};

//Section which is only displayed if a user has write permissions
export default function ReadWriteSection(props : ReadWriteSectionProps) {
    const context = useAppContext();
    return((context.user && (context.hasWriteAccess || context.hasAdminAccess)) ? props.children : null);
}