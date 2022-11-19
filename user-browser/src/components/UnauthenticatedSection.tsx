import React from "react";
import { useAppContext } from "../context/AppContext";

type SectionProps = {
    children : any;
};

//Section which only shows if a user is not authenticated
export default function UnauthenticatedSection(props : SectionProps): React.ReactElement | null {
    const context = useAppContext();
    return context.user === undefined ? props.children : null; //Only return children if user is not in app state
}