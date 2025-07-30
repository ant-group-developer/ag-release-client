import { toNonAccentVietnamese } from '@/helpers/string';
import useModalStore from '@/hooks/use-modal';
import { useGetListArtistRole } from '@/modules/artist-role/hooks/use-get-list-artist-role';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    disabledRoleIds?: string[];
};

export default function RoleArtistSelect({
    disabledRoleIds,
    fallBack,
    ...props
}: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { artistsRolesData } = useGetListArtistRole({});
    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={artistsRolesData.items.map((item) => ({
                id: item.id,
                value: item.id,
                label: item.name,
                disabled: disabledRoleIds?.includes(item.id) ?? false,
            }))}
            labelRender={labelRender}
            // dropdownRender={(menu) => {
            //     return (
            //         <div>
            //             {menu}
            //             <div className="flex justify-end py-2">
            //                 <Button
            //                     type="primary"
            //                     onClick={() =>
            //                         openModal(TYPE_MODAL_ARTIST.CREATE)
            //                     }
            //                 >
            //                     {messages('releases.createArtist')}
            //                 </Button>
            //             </div>
            //         </div>
            //     );
            // }}
        />
    );
}
