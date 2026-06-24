import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, TOnSearch } from '@/hooks/use-filter';
import { Space } from 'antd';
import { useTranslations } from 'next-intl';
import { NewsCategoryDataFilter } from '../../types';

type Props = {
    dataFilter: NewsCategoryDataFilter;
    onChangeFilter?: OnChangeFilter<NewsCategoryDataFilter>;
    onSearch: TOnSearch;
};

export const NewsCategoryHeader = ({ dataFilter, onSearch }: Props) => {
    const messages = useTranslations();
    return (
        <Space className="font-normal">
            <AppSearch
                className="w-52"
                placeholder={messages('common.search')}
                onChange={onSearch}
                defaultValue={dataFilter?.keyword}
                allowClear
            />
        </Space>
    );
};
