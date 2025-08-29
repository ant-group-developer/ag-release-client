import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_DSP } from '../../enums';
import { DspDataFilter } from '../../types';

type Props = Pick<UseFilterProps<DspDataFilter>, 'dataFilter' | 'onSearch'>;

export default function DspHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { isSystemTenant } = useAuth();

    return (
        <AppHeader className="app-header px-0 pb-3">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                </div>
            </AppHeaderGroup>
            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    {isSystemTenant && (
                        <CreateButton
                            canCreate={true}
                            text={messages('dsp.add')}
                            onClick={() => openModal(TYPE_MODAL_DSP.CREATE)}
                        />
                    )}
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
