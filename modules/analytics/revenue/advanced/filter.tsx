import DateSelect from '@/components/ui/select/date-select';
import { SIZE_ICON } from '@/constants/common';
import { OnChangeFilter } from '@/hooks/use-filter';
import { Button } from 'antd';
import { Download, Filter } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { REVENUE_ADVANCED } from './enums';
import { RevenueAdvancedDataFilter } from './types';

type Props = {
    dataFilter: RevenueAdvancedDataFilter;
    onChangeFilter: OnChangeFilter<RevenueAdvancedDataFilter>;
    toggleFilter: () => void;
};

export default function HeaderFilter({
    dataFilter,
    onChangeFilter,
    toggleFilter,
}: Props) {
    const [analyticType, setAnalyticType] = useState<REVENUE_ADVANCED>(
        REVENUE_ADVANCED.RELEASES
    );
    const messages = useTranslations();
    return (
        <div className="flex items-center justify-between">
            <div className="flex gap-2">
                <Button
                    type="primary"
                    onClick={toggleFilter}
                    icon={
                        <div>
                            <Filter size={SIZE_ICON} />
                        </div>
                    }
                    shape="circle"
                />
                <Button
                    type="primary"
                    icon={
                        <div>
                            <Download size={SIZE_ICON} />
                        </div>
                    }
                    shape="circle"
                />
            </div>
            <div className="flex items-center gap-2">
                {/* <Button
                    type={
                        dataFilter?.analyticsType === REVENUE_ADVANCED.tracks
                            ? 'primary'
                            : 'default'
                    }
                    shape="round"
                >
                    Tracks
                </Button>
                <Button
                    type={
                        dataFilter?.analyticsType === REVENUE_ADVANCED.releases
                            ? 'primary'
                            : 'default'
                    }
                    shape="round"
                >
                    Releases
                </Button>
                <Button
                    type={
                        dataFilter?.analyticsType === REVENUE_ADVANCED.artists
                            ? 'primary'
                            : 'default'
                    }
                    shape="round"
                >
                    Artists
                </Button>
                <Button
                    type={
                        dataFilter?.analyticsType === REVENUE_ADVANCED.labels
                            ? 'primary'
                            : 'default'
                    }
                    shape="round"
                >
                    Labels
                </Button> */}

                {Object.values(REVENUE_ADVANCED).map((item) => (
                    <Button
                        onClick={() => {
                            onChangeFilter({ analyticsType: item });
                            setAnalyticType(item);
                        }}
                        key={item}
                        type={analyticType === item ? 'primary' : 'default'}
                        shape="round"
                    >
                        {messages(`${item}.label`)}
                    </Button>
                ))}

                <DateSelect
                    selectClassName="w-[150px]"
                    rangeClassName="w-[250px]"
                    externalOnChange={(fromDate, toDate) =>
                        onChangeFilter({
                            startCreatedAt: fromDate,
                            endCreatedAt: toDate,
                        })
                    }
                    value={`${dataFilter.startCreatedAt},${dataFilter.endCreatedAt}`}
                />
            </div>
        </div>
    );
}
