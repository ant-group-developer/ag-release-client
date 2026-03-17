import AppFormItem from '@/components/ui/antd-form/form-Item';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';
import ReleaseArtistTable from '../../../table/release-artist-table';

type Props = {
    debouncedUpdate: (data: any) => void;
    isReadMode: boolean;
    isCreateReleasePage: boolean;
    releaseArtist: any[];
};

export default function ReleaseArtistSectionV2({
    debouncedUpdate,
    isReadMode,
    isCreateReleasePage,
    releaseArtist,
}: Props) {
    const { control, watch } = useFormContext<ReleaseDetailSchema>();
    const messages = useTranslations();
    const isVariousArtist = watch('isVariousArtist');

    return (
        <div id="release-artist" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('releaseArtist.label')}
            </span>
            <div>
                <AppFormItem
                    label={messages('release.isMoreThan4Artists')}
                    required
                    tooltip={messages('tooltipForm.isMoreThan4Artists')}
                    labelCol={{ span: 24 }}
                    wrapperCol={{ span: 24 }}
                >
                    <Controller
                        control={control}
                        name="isVariousArtist"
                        render={({ field }) => (
                            <Radio.Group
                                {...field}
                                onChange={(e) => {
                                    const value = e.target.value;
                                    field.onChange(value);
                                    debouncedUpdate({
                                        isVariousArtist: value,
                                    });
                                }}
                                disabled={isCreateReleasePage || isReadMode}
                            >
                                <Radio value={false}>
                                    {messages('common.no')}
                                </Radio>
                                <Radio value={true}>
                                    {messages('common.yes')}{' '}
                                    {` (${messages('artist.descriptionVariantArtists')})`}
                                </Radio>
                            </Radio.Group>
                        )}
                    />
                </AppFormItem>

                {!isVariousArtist && (
                    <div className="mt-4">
                        <ReleaseArtistTable
                            dataSource={releaseArtist}
                            disabled={isReadMode}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}
