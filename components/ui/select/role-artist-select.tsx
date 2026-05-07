import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListSimpleArtistRole } from '@/modules/artist-role/hooks/use-get-list-simple-artist-role';
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
    const { artistsRolesData, isLoading } = useGetListSimpleArtistRole();
    const labelRender = (props: any) => {
        const { value } = props;
        if (value) {
            const matched = artistsRolesData.find((r) => r.id === value);
            return fallBack || matched?.name || value;
        }
    };

    return (
        <Select
            {...props}
            loading={props?.loading || isLoading}
            showSearch
            filterOption={(input, option) =>
                toNonAccentVietnamese(option?.name ?? '')
                    .toLowerCase()
                    .includes(toNonAccentVietnamese(input).toLowerCase())
            }
            options={artistsRolesData.map((item) => {
                const isLyricist = item?.name
                    ?.toLowerCase()
                    .includes('lyricist');
                const isRequired = item?.isRequired;
                return {
                    id: item.id,
                    value: item.id,
                    name: item.name,
                    label: (
                        <div className="flex justify-between gap-1">
                            <span
                                title={item.name}
                                className="min-w-0 truncate"
                            >
                                {item.name}
                            </span>
                            <span className="text-red-400">
                                {!isLyricist && isRequired
                                    ? messages('common.required')
                                    : ''}
                            </span>
                        </div>
                    ),
                    disabled: disabledRoleIds?.includes(item.id) ?? false,
                };
            })}
            labelRender={labelRender}
        />
    );
}
