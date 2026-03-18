'use client';

import AppFormItem from '@/components/ui/antd-form/form-Item';
import GenresSelect from '@/components/ui/select/genres-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { TrackData } from '@/modules/tracks/types';
import { ConfigProvider, Form, Typography } from 'antd';
import { useTranslations } from 'next-intl';

const { Title } = Typography;

type Props = {
    index: number;
    debouncedUpdateTrackDraft: (data: any) => void;
    trackData: TrackData;
};

export default function GenreSection({
    index,
    debouncedUpdateTrackDraft,
    trackData,
}: Props) {
    // hooks
    const messages = useTranslations();
    const { action } = useGetReleaseDetailRoute();
    const form = Form.useFormInstance();
    const releaseAction = useReleaseActionStore((s) => s.action);
    const isReadMode = releaseAction === RELEASE_DETAIL_ACTION.READ;

    // handle change
    const updateTrackDraft = async (data: any, fieldName?: string) => {
        if (fieldName) {
            try {
                await form.validateFields([fieldName]);
            } catch {
                return;
            }
        }
        debouncedUpdateTrackDraft(data);
    };

    return (
        <ConfigProvider
            componentDisabled={isReadMode}
            form={{ variant: isReadMode ? 'underlined' : 'outlined' }}
        >
            <div className="space-y-4">
                <p className="text-base font-semibold">
                    {messages('genre.label')}
                </p>
                <div className="grid grid-cols-2 gap-4">
                    {/* Primary Genre */}
                    <AppFormItem
                        label={messages('genres.primary')}
                        name="primaryGenreId"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <GenresSelect
                            id={`tracks.${index}.primaryGenreId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            onChange={(value) => {
                                updateTrackDraft(
                                    { primaryGenreId: value },
                                    'primaryGenreId'
                                );
                            }}
                        />
                    </AppFormItem>

                    {/* Sub Genre */}
                    <AppFormItem
                        label={messages('common.subGenres')}
                        name="subGenreId"
                        // required
                        // rules={[
                        //     {
                        //         required: true,
                        //         message:
                        //             messages('validation.input'),
                        //     },
                        // ]}
                    >
                        <GenresSelect
                            id={`tracks.${index}.subGenreId`}
                            className="w-full"
                            showSearch
                            allowClear
                            disabled={isReadMode}
                            onChange={(value) => {
                                updateTrackDraft(
                                    { subGenreId: value },
                                    'subGenreId'
                                );
                            }}
                        />
                    </AppFormItem>
                </div>
            </div>
        </ConfigProvider>
    );
}
