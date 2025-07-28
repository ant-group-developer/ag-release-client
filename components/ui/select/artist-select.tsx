import { toNonAccentVietnamese } from '@/helpers/string';
import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
import { ArtistData } from '@/modules/artist/types';
import { Button, Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = SelectProps & {
    onCreateArtist?: () => void;
    fallBack?: string;
    disabledArtistIds?: string[];
};

export default function ArtistSelect({
    fallBack,
    disabledArtistIds,
    onCreateArtist,
    ...props
}: Props) {
    const messages = useTranslations();
    const { artistsData } = useGetListArtist({});
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
            options={artistsData.items.map((item: ArtistData) => ({
                id: item.id,
                value: item.id,
                label: item.name,
                disabled: disabledArtistIds?.includes(item.id) ?? false,
            }))}
            labelRender={labelRender}
            dropdownRender={(menu) => {
                return (
                    <div>
                        {menu}
                        <div className="py-1">
                            <Button
                                type="primary"
                                className="w-full"
                                onClick={onCreateArtist}
                            >
                                {messages('releases.createArtist')}
                            </Button>
                        </div>
                    </div>
                );
            }}
        />
    );
}
