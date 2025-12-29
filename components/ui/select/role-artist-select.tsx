import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
import { Select, SelectProps } from 'antd';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
    disabledRoleIds?: string[];
};

export default function RoleArtistSelect({
    disabledRoleIds,
    fallBack,
    ...props
}: Props) {
    const { artistsRolesData, isLoading } = useGetListSimpleArtistRole();
    const labelRender = (props: any) => {
        const { value, label } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            {...props}
            loading={props?.loading || isLoading}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.label ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={artistsRolesData.map((item) => ({
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
            //                     {messages('release.createArtist')}
            //                 </Button>
            //             </div>
            //         </div>
            //     );
            // }}
        />
    );
}
