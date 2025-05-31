import useModalStore from '@/hooks/use-modal';
import { roleArtist } from '@/modules/artist/constants';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {};

export default function RoleArtistSelect({ ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    return (
        <Select
            {...props}
            options={roleArtist.map((item) => ({
                id: item.id,
                value: item.name,
                label: item.name,
            }))}
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
