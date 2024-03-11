export type FormFieldProps = {
    label: string;
    type?: string;
    name: string;
    defaultValue?: string;
}

export default function FormField(props: FormFieldProps) {
    return (
        <>
            <div className="field">
                <label className="label">{props.label}</label>
                <input type={props.type ?? "text"} className="input" name={props.name} defaultValue={props.defaultValue} />
            </div>
        </>
    )
}