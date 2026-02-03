import IconInfoTooltip from '../tooltip/icon-info-tooltip';

export interface LabelFormProps {
    htmlFor?: string;
    label: string;
    required?: boolean;
    tooltipInfor?: string;
}

export const LabelForm = ({
    htmlFor,
    label,
    required,
    tooltipInfor,
}: LabelFormProps) => (
    <div className="mb-1 flex font-medium">
        <label htmlFor={htmlFor}>
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltipInfor && (
            <div className="pl-1">
                <IconInfoTooltip title={tooltipInfor} />
            </div>
        )}
    </div>
);
