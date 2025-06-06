import React from "react"

interface CheckboxProps {
    id: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    name: string;
    checked: boolean;
}

const Checkbox = ({ id, onChange, name, checked }: CheckboxProps) => {
    return (
        <div>
            <input
                id={id}
                type="checkbox"
                className="checkbox checkbox-secondary"
                onChange={onChange}
                name={name}
                checked={checked}
            />
        </div>
    )
}

export default Checkbox