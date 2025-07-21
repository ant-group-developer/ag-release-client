import useModalStore from '@/hooks/use-modal';
import { useGetListArtistRole } from '@/modules/artist-role/hooks/use-get-list-artist-role';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

export default function RoleArtistSelect({ fallBack, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { artistsRolesData } = useGetListArtistRole({});
    const labelRender = (props: SelectProps) => {
        const { value } = props;
        if (value) {
            return fallBack || value;
        }
    };
    return (
        <Select
            {...props}
            options={artistsRolesData.items.map((item) => ({
                id: item.id,
                value: item.id,
                label: item.name,
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
