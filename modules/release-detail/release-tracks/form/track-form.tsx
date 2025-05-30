import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import IconInfoTooltip from '@/components/ui/tooltip/icon-info-tooltip';
import { artistList, languageList } from '@/constants/fakeData';
import { TrackData } from '@/modules/tracks/types';
import { Input, Select } from 'antd';
import { useTranslations } from 'next-intl';

type Props = {
    trackData: TrackData;
};

export default function TracksForm({ trackData }: Props) {
    const originalSourceList = [
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Tác phẩm gốc{' '}
                    <IconInfoTooltip title="Tác phẩm gốc là tác phẩm được tạo ra đầu tiên, không phải bất kỳ bản cover hoặc remix nào." />
                </span>
            ),
            value: 'original',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Bản cover
                    <IconInfoTooltip title="Bản cover là bản nhạc được cover lại từ tác phẩm gốc, có thể có sự thay đổi về âm nhạc, lời bài hát, hoặc cả hai." />
                </span>
            ),
            value: 'cover',
        },
        {
            label: (
                <span className="flex items-center justify-between gap-1">
                    Bản remix
                    <IconInfoTooltip title="Bản remix là bản nhạc được tạo ra từ tác phẩm gốc, có thể có sự thay đổi về âm nhạc, lời bài hát, hoặc cả hai." />
                </span>
            ),
            value: 'remix',
        },
    ];

    const messages = useTranslations();
    return (
        <div>
            <AppForm layout="vertical" showSubmit={false}>
                <div className="grid grid-cols-2 gap-4">
                    <AppFormItem
                        label="Tên bài hát"
                        name="nameRelease"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input defaultValue={trackData.title} allowClear />
                    </AppFormItem>

                    <AppFormItem label="ISRC" name="isrc">
                        <Input allowClear />
                    </AppFormItem>
                    {/* <AppFormItem
                        label="Tên hiển thị"
                        name="nameDisplay"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input allowClear />
                    </AppFormItem> */}
                    <AppFormItem
                        label="Chọn nghệ sĩ chính"
                        name="artist"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            defaultValue={trackData.artist}
                            options={artistList}
                            showSearch
                            allowClear
                        />
                    </AppFormItem>
                    <AppFormItem label="Chọn nghệ sĩ phụ" name="subArtist">
                        <Select
                            mode="multiple"
                            options={artistList}
                            showSearch
                            allowClear
                        />
                    </AppFormItem>

                    <AppFormItem
                        label="Nguồn gốc"
                        name="source"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            className="w-full"
                            options={originalSourceList}
                            allowClear
                        />
                    </AppFormItem>

                    <AppFormItem
                        label="Ngôn ngữ bài hát"
                        name="languageTrack"
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            className="w-full"
                            options={languageList}
                            allowClear
                            showSearch
                        />
                    </AppFormItem>
                </div>
            </AppForm>
        </div>
    );
}
