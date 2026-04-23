'use client';

import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import AppModal from '@/components/ui/modal/normal-modal';
import CountrySelect from '@/components/ui/select/country-select';
import GenresSelect from '@/components/ui/select/genres-select';
import LanguageSelect from '@/components/ui/select/language-select';
import OriginalTypeSelect from '@/components/ui/select/original-type-select';
import TrackTypesSelect from '@/components/ui/select/track-types-select';
import { showNotification } from '@/helpers/messages-helper';
import useModalStore from '@/hooks/use-modal';
import SensitiveContentSelect from '@/modules/track-sensitive/components/select/isSensitiveContent-select';
import { useBulkUpdateTrack } from '@/modules/tracks/hooks/use-bulk-update-track';
import { DatePicker, Form, Input, Radio, theme } from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';
import { Key } from 'react';

type Props = {
    selectedRowKeys: Key[];
    // tracks?: TrackData[];
    onSuccess?: () => void;
};

export default function BulkUpdateTracksModal({
    selectedRowKeys,
    // tracks,
    onSuccess,
}: Props) {
    const messages = useTranslations();
    const [form] = Form.useForm();
    const closeModal = useModalStore((state) => state.closeModal);
    const { token } = theme.useToken();
    const { bulkUpdateTrack, isPending } = useBulkUpdateTrack();

    const maxYear = dayjs().year() + 1;
    const disabledYear = (current: dayjs.Dayjs) => {
        return current && current.year() > maxYear;
    };

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            const {
                metadataLanguageCountryId,
                audioLanguageId,
                metadataLanguageId,
                recordingCountryId,
                ...rest
            } = values;

            // Lọc bỏ null/undefined
            const cleanValues = (obj: Record<string, any>) =>
                Object.fromEntries(
                    Object.entries(obj).filter(
                        ([_, v]) => v !== null && v !== undefined
                    )
                );

            const trackLanguage = cleanValues({
                metadataLanguageCountryId,
                audioLanguageId,
                metadataLanguageId,
                recordingCountryId,
            });

            const updateData = cleanValues({
                ...rest,
                trackLanguage: Object.keys(trackLanguage).length
                    ? trackLanguage
                    : undefined,
            });

            const trackDrafts = selectedRowKeys.map((id) => ({
                id: id as string,
                ...updateData,
            }));

            closeModal();
            showNotification('info', messages('message.jobIsProcessing'));

            bulkUpdateTrack({
                trackDrafts,
                onSuccess(e) {
                    onSuccess?.();
                },
            });
        });
    };

    return (
        <AppModal
            open
            title={
                <p>
                    {messages('track.action.bulkUpdate')} (
                    {selectedRowKeys.length} {messages('common.selected')})
                </p>
            }
            onCancel={() => {
                closeModal();
                form.resetFields();
            }}
            onOk={handleSubmit}
            okButtonProps={{ disabled: isPending }}
            loading={isPending}
            width={'60vw'}
            style={{ top: '4rem' }}
            styles={{
                content: { backgroundColor: token?.colorBgContainer },
                header: { backgroundColor: token?.colorBgContainer },
            }}
        >
            <p
                className="mb-4 text-sm"
                style={{ color: token?.colorTextDescription }}
            >
                {messages('track.action.bulkUpdateDescription')}
            </p>

            <AppForm
                form={form}
                layout="vertical"
                showSubmit={false}
                variant="outlined"
                disabled={isPending}
            >
                <div className="max-h-[65vh] space-y-6 overflow-y-auto pr-2">
                    {/* ── Genre Section ── */}
                    <div className="space-y-4">
                        <p className="text-base font-semibold">
                            {messages('genre.label')}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <AppFormItem
                                label={messages('genres.primary')}
                                name="primaryGenreId"
                            >
                                <GenresSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('common.subGenres')}
                                name="subGenreId"
                            >
                                <GenresSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>
                        </div>
                    </div>

                    {/* ── Language Section ── */}
                    <div className="space-y-4">
                        <p className="text-base font-semibold">
                            {messages('language.label')}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <AppFormItem
                                label={messages('release.countryLanguage')}
                                name="metadataLanguageCountryId"
                            >
                                <CountrySelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('release.audioLanguage')}
                                name="audioLanguageId"
                            >
                                <LanguageSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('release.metadataLanguage')}
                                name="metadataLanguageId"
                            >
                                <LanguageSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>
                        </div>
                    </div>

                    {/* ── Others Section (no ISRC, no Lyrics) ── */}
                    <div className="space-y-4">
                        <p className="text-base font-semibold">
                            {messages('common.others')}
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <AppFormItem
                                label={messages(
                                    'formFields.tracks.sensitiveContent'
                                )}
                                name="trackSensitiveId"
                            >
                                <SensitiveContentSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('common.isSongCreatedByAi')}
                                name="isByAi"
                            >
                                <Radio.Group>
                                    <Radio value={true}>
                                        {messages('common.yes')}
                                    </Radio>
                                    <Radio value={false}>
                                        {messages('common.no')}
                                    </Radio>
                                </Radio.Group>
                            </AppFormItem>

                            <AppFormItem
                                label={messages('trackOriginType.label')}
                                name="trackOriginTypeId"
                            >
                                <OriginalTypeSelect
                                    className="w-full"
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('track.recordingCountry')}
                                name="recordingCountryId"
                            >
                                <CountrySelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('formFields.pLineYear')}
                                name="pLineYear"
                                getValueFromEvent={(
                                    date: dayjs.Dayjs | null
                                ) => (date ? date.year() : undefined)}
                                getValueProps={(value: number | undefined) => ({
                                    value: value ? dayjs().year(value) : null,
                                })}
                            >
                                <DatePicker
                                    picker="year"
                                    className="w-full"
                                    disabledDate={disabledYear}
                                    allowClear
                                />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('formFields.pLineOwner')}
                                name="pLineOwner"
                            >
                                <Input allowClear />
                            </AppFormItem>

                            <AppFormItem
                                label={messages('trackType.label')}
                                name="trackTypeId"
                            >
                                <TrackTypesSelect
                                    className="w-full"
                                    showSearch
                                    allowClear
                                />
                            </AppFormItem>
                        </div>
                    </div>
                </div>
            </AppForm>
        </AppModal>
    );
}
