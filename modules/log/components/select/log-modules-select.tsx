import { Select, SelectProps } from 'antd';
import { useGetLogModules } from '../../hooks/useGetLogModules';

interface Props extends SelectProps {}

export const LogModulesSelect = ({ ...props }: Props) => {
    const { modulesData, isLoading } = useGetLogModules();

    const options = modulesData.map((item) => {
        const lower = item.toLowerCase();
        const label = lower.charAt(0).toUpperCase() + lower.slice(1);
        return {
            label,
            value: item,
        };
    });

    return <Select loading={isLoading} options={options} {...props} />;
};
