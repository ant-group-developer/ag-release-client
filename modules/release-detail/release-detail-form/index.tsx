import AppForm from '@/components/ui/antd-form/form';
import AppFormItem from '@/components/ui/antd-form/form-Item';
import GenresSelect from '@/components/ui/select/genres-select';
import LabelSelect from '@/components/ui/select/label-select';
import { languageList, yearList } from '@/constants/fakeData';
import useModalStore from '@/hooks/use-modal';
import { useRouter } from '@/i18n/routing';
import {
    RELEASES_TYPE,
    TYPE_MODAL_RELEASE_ARTIST_LIST,
} from '@/modules/releases/enums';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { releaseSchema } from '@/modules/releases/schemas/schema';
import { Button, Input, Radio, Select } from 'antd';
import { useForm, useWatch } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { z } from 'zod';
import ArtistCard from './artist-card';

export default function ReleaseDetailForm() {
    const messages = useTranslations();
    const basicInfoSchema = releaseSchema(messages as any).pick({
        type: true,
        nameRelease: true,
        isMoreThan4Artists: true,
        version: true,
        artists: true,
        genres: true,
        subGenres: true,
        language: true,
        label: true,
        upc: true,
        catalogId: true,
        cLineYear: true,
        pLineYear: true,
        thumbnail: true,
    });

    type BasicInfoSchema = z.infer<typeof basicInfoSchema>;
    const [form] = useForm<BasicInfoSchema>();
    const router = useRouter();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);
    const openModal = useModalStore((state) => state.openModal);

    // Di chuyển việc lấy giá trị vào trong component
    const isMoreThan4Artists = useWatch('isMoreThan4Artists', form);

    const artists = formValues.artists || [];

    useEffect(() => {
        // Nếu formValues rỗng, reset form với giá trị mặc định
        if (Object.keys(formValues).length === 0) {
            form.resetFields();
            form.setFieldsValue({
                isMoreThan4Artists: false, // Set giá trị mặc định
            });
        } else {
            // Nếu có formValues, set vào form
            form.setFieldsValue(formValues);
        }
    }, [form, formValues]);

    // Hàm xử lý khi form thay đổi
    const handleValuesChange = (_: any, allValues: any) => {
        // Cập nhật giá trị mới vào zustand
        setFormValues(allValues);
    };

    const handleNext = () => {
        try {
            form.validateFields().then((values) => {
                setFormValues(values);
                router.push('/releases/detail/123456/tracks');
            });
        } catch (error) {
            console.error('Validation failed:', error);
        }
    };

    return (
        <div className="p-4">
            <AppForm
                form={form}
                layout="vertical"
                showSubmit
                submitText={messages('common.next')}
                submitProps={{
                    onClick: () => {
                        handleNext();
                    },
                }}
                onValuesChange={handleValuesChange}
            >
                <div className="flex flex-col gap-4">
                    <div>
                        <AppFormItem
                            label="Thể loại phát hành"
                            name="type"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Radio.Group>
                                {Object.values(RELEASES_TYPE).map((type) => {
                                    return (
                                        <Radio
                                            key={type}
                                            value={type}
                                            className="capitalize"
                                        >
                                            {type}
                                        </Radio>
                                    );
                                })}
                            </Radio.Group>
                        </AppFormItem>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <AppFormItem
                            label={messages('releases.name')}
                            name="nameRelease"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <Input allowClear />
                        </AppFormItem>
                        <AppFormItem
                            label={messages('releases.version')}
                            name="version"
                        >
                            <Input allowClear />
                        </AppFormItem>

                        {/* <div className="col-span-2">
                            <DynamicFieldContributor />
                        </div> */}

                        <div className="col-span-2">
                            <AppFormItem
                                label=" Có nhiều hơn 4 nghệ sĩ hay không ?"
                                name="isMoreThan4Artists"
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <Radio.Group>
                                    <Radio value={false}>Không</Radio>
                                    <Radio value={true}>
                                        {`Có (Tên hiển thị sẽ là "Nhiều nghệ sĩ")`}
                                    </Radio>
                                </Radio.Group>
                            </AppFormItem>
                            {!isMoreThan4Artists && (
                                <div>
                                    <div>
                                        <Button
                                            onClick={() =>
                                                openModal(
                                                    TYPE_MODAL_RELEASE_ARTIST_LIST.ADD_ARTIST
                                                )
                                            }
                                            shape="round"
                                            className="mb-4"
                                        >
                                            Thêm nghệ sĩ chính
                                        </Button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        {artists.map(
                                            (artist: any, index: number) => (
                                                <ArtistCard
                                                    data={artist}
                                                    onClick={() =>
                                                        openModal(
                                                            TYPE_MODAL_RELEASE_ARTIST_LIST.EDIT_ARTIST,
                                                            artist
                                                        )
                                                    }
                                                    key={index}
                                                    index={index}
                                                />
                                            )
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        <AppFormItem
                            label={messages('common.genres')}
                            name="genres"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <GenresSelect />
                        </AppFormItem>

                        <AppFormItem
                            label={messages('common.subGenres')}
                            name="subGenres"
                        >
                            <GenresSelect />
                        </AppFormItem>

                        <AppFormItem
                            label={messages('common.language') + ' metadata'}
                            name="language"
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.select'),
                                },
                            ]}
                        >
                            <Select options={languageList} />
                        </AppFormItem>

                        <AppFormItem label="Label" name="label">
                            <LabelSelect />
                        </AppFormItem>

                        <AppFormItem label="UPC/EAN/JAN" name="upc">
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem label="ID category" name="catalogId">
                            <Input allowClear />
                        </AppFormItem>

                        <AppFormItem
                            label="C Line year"
                            name="copyRight"
                            required
                            tooltipInfo="Năm đầu tiên xuất bản bản phát hành này trên toàn thế giới."
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <Input
                                addonBefore={
                                    <Select
                                        defaultValue={'2026'}
                                        options={yearList}
                                    />
                                }
                            />
                        </AppFormItem>

                        <AppFormItem
                            label="P Line year"
                            name="copyRight2"
                            tooltipInfo="Năm bản ghi âm đầu tiên được phát hành trên toàn thế giới."
                            required
                            rules={[
                                {
                                    required: true,
                                    message: messages('validation.input'),
                                },
                            ]}
                        >
                            <Input
                                addonBefore={
                                    <Select
                                        defaultValue={'2026'}
                                        options={yearList}
                                    />
                                }
                            />
                        </AppFormItem>
                    </div>
                </div>
            </AppForm>
        </div>
    );
}
