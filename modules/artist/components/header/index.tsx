import AppHeader, { AppHeaderGroup } from '@/components/cms/app-header';
import CreateButton from '@/components/ui/button/create-button';
import AppSearch from '@/components/ui/input/search';
import { UseFilterProps } from '@/hooks/use-filter';
import useModalStore from '@/hooks/use-modal';
import { usePermission } from '@/hooks/use-permission';
import { PERMISSION } from '@/modules/auth/constants/permission';
import { useTranslations } from 'next-intl';
import { TYPE_MODAL_ARTIST } from '../../enum';
import { ArtistDataFilter } from '../../types';

type Props = Pick<UseFilterProps<ArtistDataFilter>, 'dataFilter' | 'onSearch'>;

export default function ArtistsHeader({ dataFilter, onSearch }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { hasPermission } = usePermission();

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

            <AppHeaderGroup position="end" className="flex-1">
                <div className="flex items-center gap-2">
                    {hasPermission(PERMISSION.ARTIST.CREATE) && (
                        <CreateButton
                            canCreate={true}
                            text={messages('artist.create')}
                            onClick={() => openModal(TYPE_MODAL_ARTIST.CREATE)}
                        />
                    )}
                </div>
            </AppHeaderGroup>
        </AppHeader>
    );
}
