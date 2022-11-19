import React from "react";
import { useAppContext } from "../context/AppContext";

type SectionProps = {
    children : any;
};

export function UnauthenticatedSection(props : SectionProps): React.ReactElement | null {
    return useAppContext().user == null ? props.children : null; //Only return children if user is not in app state
}