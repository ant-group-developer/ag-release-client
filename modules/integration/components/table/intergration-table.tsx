import { AppTableProps } from '@/components/ui/table/normal-table';
import { DspData } from '@/modules/dsp/types';

type DataSource = Pick<DspData, 'id' | 'name' | 'picture' | 'updatedAt'> & {
    isActive: boolean;
    isSelected: boolean;
};

type Props = AppTableProps<DataSource> & {};

export default function Integration({}: Props) {
    return <div>integration</div>;
}
