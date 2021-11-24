import ReadAccessTemplate from "./ReadAccessTemplate"
import WriteAccessTemplate from "./WriteAccessTemplate"
import { PencilSquare } from "react-bootstrap-icons";

type EditablePropertyProps = {
    value: string | undefined | null;
}

export default function EditableProperty(props: EditablePropertyProps) {

    let value = props.value ? props.value : "";
    let updateIcon = value !== "" ? (<PencilSquare className="clickable-icon" onClick={() => { console.log("Edit")}} />) : (<span></span>); //TODO: add event handling

    return (
        <div>
            <WriteAccessTemplate>{value} {updateIcon}</WriteAccessTemplate>
            <ReadAccessTemplate>{value}</ReadAccessTemplate>
        </div>
    )
}