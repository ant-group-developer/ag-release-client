import { Select, SelectProps } from 'antd';
import { useGetLogModules } from '../../hooks/useGetLogModules';

interface Props extends SelectProps {}

export const LogModulesSelect = ({ ...props }: Props) => {
    const { modulesData, isLoading } = useGetLogModules();

    const options = modulesData.map((item) => {
        const formatted = item.toLowerCase().replace(/_/g, ' ');

        const label = formatted.charAt(0).toUpperCase() + formatted.slice(1);
        return {
            label,
            value: item,
        };
    });

    return <Select loading={isLoading} options={options} {...props} />;
};
