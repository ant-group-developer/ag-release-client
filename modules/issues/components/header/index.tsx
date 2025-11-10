import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import IssueLevelSelect from '@/components/ui/select/issue-level-select';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ISSUES } from '../../enums';
import { IssueDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<IssueDataFilter>,
    'dataFilter' | 'onSearch' | 'onChangeFilter'
>;

export const IssueHeader = ({
    dataFilter,
    onSearch,
    onChangeFilter,
}: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    return (
        <AppHeader className="border-b-0 px-0 pb-3">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                </div>
                <IssueLevelSelect
                    placeholder={messages('issueLevel.label')}
                    className="min-w-44"
                    allowClear
                    onChange={(e) => onChangeFilter({ issueLevelId: e })}
                />
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    <CreateButton
                        canCreate={true}
                        text={messages('action.create.button')}
                        onClick={() => openModal(TYPE_MODAL_ISSUES.CREATE)}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
};
