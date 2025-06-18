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
    <div className="mb-1 flex justify-between">
        <label htmlFor={htmlFor} className="font-semibold">
            {label} {required && <span className="text-red-500">*</span>}
        </label>
        {tooltipInfor && (
            <div className="pr-2">
                <IconInfoTooltip title={tooltipInfor} />
            </div>
        )}
    </div>
);
