import React from "react";
import { useAppContext } from "../context/AppContext";

type SectionProps = {
    children : any;
};

//This section only displays children if the a user is logged in
export default function AuthenticatedSection(props : SectionProps): React.ReactElement | null {
    const context = useAppContext();
    return context.appUser !== undefined ? props.children : null; //Only return children if user is in app context
}