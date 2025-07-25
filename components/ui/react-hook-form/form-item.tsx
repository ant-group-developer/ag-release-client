import { LabelForm } from '../label/labelForm';
import ErrorText from '../text/error-text';

type FormItemProps = {
    name: string;
    label: string;
    required?: boolean;
    control?: any;
    children: React.ReactNode;
    ErrorMessage: string | undefined;
    className?: string;
    tooltipInfor?: string;
};

export default function FormItem({
    name,
    label,
    required = false,
    children,
    ErrorMessage,
    className,
    tooltipInfor,
}: FormItemProps) {
    const isError = (ErrorMessage?.length ?? 0 > 0) ? true : false;
    return (
        <div className={`${className} relative`}>
            <LabelForm
                htmlFor={name}
                required={required}
                label={label}
                tooltipInfor={tooltipInfor}
            />
            {children}
            <ErrorText isError={isError} message={ErrorMessage} />
        </div>
    );
}
