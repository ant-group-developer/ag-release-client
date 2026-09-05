import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetSourceTypeConfigs } from '@/modules/report-import/hooks/use-get-source-type-configs';
import { Select, SelectProps } from 'antd';
import { useMemo } from 'react';

type Props = SelectProps & {
    fallBack?: string;
};

export default function SourceTypeSelect({ fallBack, ...props }: Props) {
    const { sourceTypeConfigsData, isLoading, isFetching } =
        useGetSourceTypeConfigs();

    const options = useMemo(() => {
        if (!sourceTypeConfigsData || sourceTypeConfigsData.length === 0) {
            return [];
        }

        return sourceTypeConfigsData
            .filter((item) => item.isActive !== false)
            .map((item) => ({
                value: item.sourceType,
                label: item.label
                    ? `${item.label} (${item.sourceType})`
                    : item.sourceType,
            }));
    }, [sourceTypeConfigsData]);

    const finalOptions = useMemo(() => {
        const val = props.value as string | undefined;
        if (val && !options.some((opt) => opt.value === val)) {
            return [
                ...options,
                {
                    value: val,
                    label: val,
                },
            ];
        }
        return options;
    }, [options, props.value]);

    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            loading={isLoading || isFetching || props.loading}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(String(option?.label ?? ''))
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={finalOptions}
            labelRender={labelRender}
        />
    );
}
