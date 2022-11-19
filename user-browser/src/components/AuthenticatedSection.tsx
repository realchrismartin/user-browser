import React from "react";
import { useAppContext } from "../context/AppContext";

type SectionProps = {
    children : any;
};

export function AuthenticatedSection(props : SectionProps): React.ReactElement | null {
    return useAppContext().user == null ? null : props.children; //Only return children if user is in app context
}