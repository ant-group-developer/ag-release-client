import { InputNumber } from 'antd';
import { ProductData } from '../../types';

type Props = {
    record: ProductData;
    editRateCell: string;
    setEditRateCell: (value: string) => void;
    handleChangeRate: (e: any, record: ProductData) => void;
    canManage: boolean;
};

export default function RateCell({
    record,
    editRateCell,
    setEditRateCell,
    handleChangeRate,
    canManage,
}: Props) {
    const handleBlur = (e: any) => {
        if (e.target.value == record?.rate) return setEditRateCell('');
        handleChangeRate(e, record);
    };

    return (
        <div>
            {editRateCell !== record?.id && (
                <div
                    onClick={() => {
                        if (canManage) {
                            setEditRateCell(record?.id);
                        }
                    }}
                    className="cursor-pointer rounded-lg py-1 group-hover:border"
                >
                    {record?.rate ?? 0}
                </div>
            )}
            {editRateCell === record?.id && (
                <div>
                    <InputNumber
                        autoFocus
                        min={1}
                        value={record?.rate}
                        onBlur={(e) => {
                            handleBlur(e);
                        }}
                        onPressEnter={(e) => handleChangeRate(e, record)}
                    />
                </div>
            )}
        </div>
    );
}
