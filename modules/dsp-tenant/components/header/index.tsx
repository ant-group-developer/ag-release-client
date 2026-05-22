import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { useAuth } from '@/modules/auth/hooks/use-auth';
import { DspDataFilter } from '@/modules/dsp/types';
import { useTranslations } from 'next-intl';

type Props = Pick<UseFilterProps<DspDataFilter>, 'dataFilter' | 'onSearch'>;

export default function DspHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { isSystemTenant } = useAuth();

    return (
        <AppHeader className="app-header border-b-0 px-0 pb-3">
            <AppHeaderGroup>
                <div>
                    <AppSearch
                        className="max-w-52"
                        onChange={onSearch}
                        defaultValue={dataFilter.keyword}
                    />
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
