import AppFormItem from '@/components/ui/antd-form/form-Item';
import ImageListUpload from '@/components/ui/input/image-list-upload';
import { ACCEPT_IMAGE, MAX_NAME_LENGTH } from '@/constants/validate';
import { useCommonFormRules } from '@/hooks/useCommonFormRules';
import { FormInstance, Input, Radio, Switch } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useTranslations } from 'next-intl';
import { DSP_TYPE } from '../../enums';

type Props = {
    form: FormInstance<any>;
    isActive: boolean;
};

export default function DspGeneral({ form, isActive }: Props) {
    const messages = useTranslations();

    const formRules = useCommonFormRules();

    return (
        <>
            <AppFormItem
                name="pictureFile"
                label={messages('common.image')}
                // required
                // rules={[
                //     {
                //         required: true,
                //         message: messages('validation.input'),
                //     },
                // ]}
            >
                <ImageListUpload
                    maxCount={1}
                    accept={ACCEPT_IMAGE}
                    maxSizeMB={3}
                    description={
                        <ul className="space-y-1 text-xs">
                            <li className="flex-1 text-sm text-gray-500">
                                {messages(
                                    'image.validation.supportImageFormat',
                                    {
                                        value: 'PNG, JPG, WEBP, SVG, ICON',
                                    }
                                )}
                            </li>
                            <li className="flex-1 text-sm text-gray-500">
                                {messages('image.validation.mustBeLessThanMB', {
                                    value: '3',
                                })}
                            </li>
                        </ul>
                    }
                    disabled={isActive}
                />
            </AppFormItem>
            <AppFormItem
                name="name"
                label={messages('dsp.name')}
                required
                rules={[
                    formRules.required(),
                    formRules.stringMax({ field: messages('dsp.name') }),
                    formRules.stringMin({ min: 2, field: messages('dsp.name') }),
                    {
                        whitespace: true,
                        message: messages('validation.input'),
                    },
                    {
                        validator: (_, value) => {
                            if (value && value.includes('_')) {
                                return Promise.reject(
                                    messages('validation.noUnderscore', {
                                        field: messages('dsp.name'),
                                    })
                                );
                            }
                            return Promise.resolve();
                        },
                    },
                ]}
            >
                <Input allowClear />
            </AppFormItem>
            <AppFormItem
                name="codeCi"
                label={messages('dsp.codeCi')}
                rules={[formRules.stringMax({ field: messages('dsp.codeCi') })]}
            >
                <Input allowClear />
            </AppFormItem>
            <AppFormItem
                name="link"
                label={'Format links'}
                tooltipInfo={messages('dsp.oneLinkPerLine')}
                required
                rules={[
                    formRules.required(),
                    formRules.stringMax({ field: 'Format links' }),
                ]}
            >
                <TextArea
                    allowClear
                    autoSize={{
                        maxRows: 7,
                        minRows: 3,
                    }}
                />
            </AppFormItem>
            <AppFormItem
                name="ddexId"
                label={messages('dsp.ddexPartyId')}
                rules={[
                    {
                        max: MAX_NAME_LENGTH,
                        message: messages('validation.stringMax', {
                            max: MAX_NAME_LENGTH,
                            field: 'DDexId',
                        }),
                    },
                ]}
            >
                <Input allowClear />
            </AppFormItem>

            <AppFormItem
                name="ddexName"
                label={messages('dsp.fullNameOfDDexParty')}
                rules={[
                    {
                        max: MAX_NAME_LENGTH,
                        message: messages('validation.stringMax', {
                            max: MAX_NAME_LENGTH,
                            field: messages('aggregator.ddexName'),
                        }),
                    },
                ]}
            >
                <Input allowClear />
            </AppFormItem>
            <AppFormItem
                name="type"
                label={messages('dsp.type')}
                required
                rules={[
                    {
                        required: true,
                        message: messages('validation.radio'),
                    },
                ]}
            >
                <Radio.Group disabled={isActive}>
                    <Radio value={DSP_TYPE.AUDIO}>
                        {messages('common.audio')}
                    </Radio>
                    <Radio value={DSP_TYPE.VIDEO}>
                        {messages('common.video')}
                    </Radio>
                </Radio.Group>
            </AppFormItem>
            <AppFormItem
                name="isActive"
                valuePropName="checked"
                label={
                    <div className="text-wrap pb-2">
                        {messages('status.active')}
                    </div>
                }
                required
                rules={[
                    {
                        required: true,
                        message: messages('validation.input'),
                    },
                ]}
            >
                <Switch />
            </AppFormItem>
            <AppFormItem
                className="!mb-1"
                name="enablePolicy"
                valuePropName="checked"
                label={
                    <div className="text-wrap pb-2">
                        {messages('status.active')}{' '}
                        {messages('common.policies').toLowerCase()}
                    </div>
                }
            >
                <Switch />
            </AppFormItem>
            <AppFormItem
                className="!mb-1"
                name="hasDeal"
                valuePropName="checked"
                label={
                    <div className="text-wrap pb-2">
                        {messages('dsp.hasDeal')}
                    </div>
                }
            >
                <Switch />
            </AppFormItem>
            <AppFormItem
                className="!mb-1"
                name="isDefault"
                valuePropName="checked"
                label={
                    <div className="text-wrap pb-2">
                        {messages('roles.isDefault')}
                    </div>
                }
            >
                <Switch />
            </AppFormItem>
        </>
    );
}
