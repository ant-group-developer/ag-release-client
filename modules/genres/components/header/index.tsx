import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { OnChangeFilter, UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { Select, Space } from 'antd';
import { useTranslations } from 'next-intl';
import { GENRE_SCOPE, TYPE_MODAL_GENRES } from '../../enums';
import { GenresDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<GenresDataFilter>,
    'dataFilter' | 'onSearch'
> & {
    onChangeFilter?: OnChangeFilter<GenresDataFilter>;
};

export default function GenresHeader({
    dataFilter,
    onChangeFilter,
    onSearch,
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="app-header p-2">
            <AppHeaderGroup>
                <Space>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                    <Select
                        className="w-44"
                        allowClear
                        placeholder={messages('common.scope')}
                        value={dataFilter.scope}
                        onChange={(value) => onChangeFilter?.({ scope: value })}
                        options={[
                            {
                                label: messages('common.audio'),
                                value: GENRE_SCOPE.AUDIO,
                            },
                            {
                                label: messages('common.video'),
                                value: GENRE_SCOPE.VIDEO,
                            },
                            {
                                label: messages('common.both'),
                                value: GENRE_SCOPE.BOTH,
                            },
                        ]}
                    />
                </Space>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text={messages('genres.add')}
                        onClick={() => openModal(TYPE_MODAL_GENRES.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
