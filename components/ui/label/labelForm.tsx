export interface LabelFormProps {
    htmlFor?: string;
    label: string;
    required?: boolean;
}

export const LabelForm = ({ htmlFor, label, required }: LabelFormProps) => (
    <div className="mb-1">
        <label htmlFor={htmlFor} className="font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
    </div>
);
