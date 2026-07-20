import AppFormItem from '@/components/ui/antd-form/form-Item';
import CountrySelect from '@/components/ui/select/country-select';
import TimezoneSelect from '@/components/ui/select/timezone-select';
import { DATE_FORMAT, DISTRIBUTE_TYPES } from '@/enums/common';
import { RELEASE_VIDEO_VISIBILITY } from '@/modules/release-video/enums';
import { RELEASE_TIME_MODE } from '@/modules/releases/enums';
import {
    Alert,
    Col,
    DatePicker,
    Form,
    FormInstance,
    Radio,
    Row,
    Select,
    TimePicker,
} from 'antd';
import dayjs from 'dayjs';
import { useTranslations } from 'next-intl';

import { ReleasesData } from '@/modules/releases/types';

interface DistributionTabProps {
    dataEdit?: ReleasesData;
    onFieldUpdate?: (payload: Record<string, any>) => void;
    form: FormInstance;
}

export default function DistributionTab({
    dataEdit,
    onFieldUpdate,
    form,
}: DistributionTabProps) {
    const messages = useTranslations();
    const releaseTimeMode = Form.useWatch('releaseTimeMode', form);
    const distributeWorldwide = Form.useWatch(
        ['releaseTerritory', 'distributeWorldwide'],
        form
    );

    return (
        <div className="mx-auto w-full pb-8 pt-4">
            <Alert
                message={messages('releaseVideo.fields.visibilityWarning')}
                type="info"
                showIcon
                className="!mb-4"
            />
            <AppFormItem
                name={['video', 'visibility']}
                label={messages('releaseVideo.fields.visibility')}
            >
                <Select
                    // disabled
                    className="w-full"
                    placeholder={messages(
                        'releaseVideo.fields.selectVisibility'
                    )}
                    onChange={(value) =>
                        onFieldUpdate?.({ video: { visibility: value } })
                    }
                    options={[
                        {
                            value: RELEASE_VIDEO_VISIBILITY.DEFAULT,
                            label: messages(
                                'releaseVideo.fields.visibilityDefault'
                            ),
                        },
                        {
                            value: RELEASE_VIDEO_VISIBILITY.UNLISTED_ON_YOUTUBE,
                            label: messages(
                                'releaseVideo.fields.unlistedOnYoutube'
                            ),
                        },
                        {
                            value: RELEASE_VIDEO_VISIBILITY.UNLISTED_ON_VEVO,
                            label: messages(
                                'releaseVideo.fields.unlistedOnVevo'
                            ),
                        },
                        {
                            value: RELEASE_VIDEO_VISIBILITY.UNLISTED_ON_YOUTUBE_VEVO,
                            label: messages(
                                'releaseVideo.fields.unlistedOnYoutubeVevo'
                            ),
                        },
                    ]}
                />
            </AppFormItem>

            <Row gutter={[32, 16]} className="mt-6">
                <Col span={12}>
                    <AppFormItem
                        name="releaseDate"
                        label={messages('release.releaseDate')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                        getValueProps={(value) => ({
                            value: value ? dayjs(value) : null,
                        })}
                        normalize={(value) =>
                            value ? value.toISOString() : null
                        }
                    >
                        <DatePicker
                            className="w-full"
                            format={DATE_FORMAT.DATE_ONLY}
                            onChange={(date) =>
                                onFieldUpdate?.({
                                    releaseDate: date
                                        ? date.toISOString()
                                        : null,
                                })
                            }
                        />
                    </AppFormItem>
                </Col>

                <Col span={12}>
                    <AppFormItem
                        name="releaseEndDate"
                        label={messages('release.releaseEndDate')}
                        getValueProps={(value) => ({
                            value: value ? dayjs(value) : null,
                        })}
                        normalize={(value) =>
                            value ? value.toISOString() : null
                        }
                    >
                        <DatePicker
                            className="w-full"
                            format={DATE_FORMAT.DATE_ONLY}
                            onChange={(date) =>
                                onFieldUpdate?.({
                                    releaseEndDate: date
                                        ? date.toISOString()
                                        : null,
                                })
                            }
                        />
                    </AppFormItem>
                </Col>

                <Col span={12}>
                    <AppFormItem
                        name="releaseTimeMode"
                        label={messages('release.scheduling.goLiveTime')}
                        initialValue={RELEASE_TIME_MODE.GLOBAL_MIDNIGHT}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Radio.Group
                            className="flex flex-col gap-2"
                            onChange={(e) =>
                                onFieldUpdate?.({
                                    releaseTimeMode: e.target.value,
                                })
                            }
                        >
                            <Radio value={RELEASE_TIME_MODE.GLOBAL_MIDNIGHT}>
                                {messages(
                                    'release.scheduling.atMidnightInEveryCountry'
                                )}
                            </Radio>
                            <Radio value={RELEASE_TIME_MODE.SPECIFIC_TIMEZONE}>
                                {messages('release.scheduling.atSpecificTime')}
                            </Radio>
                        </Radio.Group>
                    </AppFormItem>

                    {releaseTimeMode ===
                        RELEASE_TIME_MODE.SPECIFIC_TIMEZONE && (
                        <Row gutter={16}>
                            <Col span={12}>
                                <AppFormItem
                                    name="releaseTimezoneId"
                                    label={messages('timezone.zone')}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                >
                                    <TimezoneSelect
                                        onChange={(value) =>
                                            onFieldUpdate?.({
                                                releaseTimezoneId: value,
                                            })
                                        }
                                    />
                                </AppFormItem>
                            </Col>
                            <Col span={12}>
                                <AppFormItem
                                    name="releaseTime"
                                    label={messages('common.releaseTime')}
                                    required
                                    rules={[
                                        {
                                            required: true,
                                            message:
                                                messages('validation.select'),
                                        },
                                    ]}
                                    getValueProps={(value) => ({
                                        value: value
                                            ? dayjs(
                                                  value,
                                                  DATE_FORMAT.HOUR_MINUTE
                                              )
                                            : null,
                                    })}
                                    normalize={(value) =>
                                        value
                                            ? value.format(
                                                  DATE_FORMAT.HOUR_MINUTE
                                              )
                                            : ''
                                    }
                                >
                                    <TimePicker
                                        className="w-full"
                                        format={DATE_FORMAT.HOUR_MINUTE}
                                        showSecond={false}
                                        onChange={(time) =>
                                            onFieldUpdate?.({
                                                releaseTime: time
                                                    ? time.format(
                                                          DATE_FORMAT.HOUR_MINUTE
                                                      )
                                                    : '',
                                            })
                                        }
                                    />
                                </AppFormItem>
                            </Col>
                        </Row>
                    )}
                </Col>

                <Col span={12}>
                    <AppFormItem
                        name={['releaseTerritory', 'distributeWorldwide']}
                        label={messages('distribute.wordWide')}
                        initialValue={true}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Radio.Group
                            onChange={(e) =>
                                onFieldUpdate?.({
                                    releaseTerritory: {
                                        distributeWorldwide: e.target.value,
                                    },
                                })
                            }
                        >
                            <Radio value={true}>{messages('common.yes')}</Radio>
                            <Radio value={false}>{messages('common.no')}</Radio>
                        </Radio.Group>
                    </AppFormItem>

                    {distributeWorldwide === false && (
                        <>
                            <AppFormItem
                                name={['releaseTerritory', 'distributionType']}
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <Radio.Group
                                    className="flex flex-col gap-2"
                                    onChange={(e) =>
                                        onFieldUpdate?.({
                                            releaseTerritory: {
                                                distributionType:
                                                    e.target.value,
                                            },
                                        })
                                    }
                                >
                                    <Radio
                                        value={
                                            DISTRIBUTE_TYPES.DISTRIBUTE_ONLY_IN
                                        }
                                    >
                                        {messages('distribute.onlyIn')}
                                    </Radio>
                                    <Radio
                                        value={
                                            DISTRIBUTE_TYPES.DISTRIBUTE_EVERY_WHERE_EXCEPT
                                        }
                                    >
                                        {messages(
                                            'distribute.everyWhereExcept'
                                        )}
                                    </Radio>
                                </Radio.Group>
                            </AppFormItem>

                            <AppFormItem
                                name={['releaseTerritory', 'selectedCountries']}
                                label={messages('common.region')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <CountrySelect
                                    className="w-full"
                                    mode="multiple"
                                    allowClear
                                    maxTagCount="responsive"
                                    onChange={(value) =>
                                        onFieldUpdate?.({
                                            releaseTerritory: {
                                                selectedCountries: value,
                                            },
                                        })
                                    }
                                />
                            </AppFormItem>
                        </>
                    )}
                </Col>
            </Row>
        </div>
    );
}
