import AppFormItem from '@/components/ui/antd-form/form-Item';
import LanguageSelect from '@/components/ui/select/language-select';
import AppSwitch from '@/components/ui/switch/status-switch';
import { MAX_NAME_LENGTH } from '@/constants/validate';
import { Col, FormInstance, Input, Row, Select, Upload } from 'antd';
import { useTranslations } from 'next-intl';
import ReactPlayer from 'react-player';

interface DetailsTabProps {
    form: FormInstance;
    videoUrl: string;
    setVideoUrl: (url: string) => void;
    thumbnailUrl: string;
    setThumbnailUrl: (url: string) => void;
}

export default function DetailsTab({
    form,
    videoUrl,
    setVideoUrl,
    thumbnailUrl,
    setThumbnailUrl,
}: DetailsTabProps) {
    const messages = useTranslations();

    return (
        <div className="mx-auto w-full pb-8 pt-4">
            <Row gutter={32}>
                {/* Left Side: VEVO Video Assets Management Column */}
                <Col
                    span={8}
                    className="flex flex-col gap-6 border-r border-gray-100 pr-6"
                >
                    {/* Video Player Display Screen */}
                    <div className={`group relative flex aspect-video w-full flex-col items-center justify-center overflow-hidden rounded-xl transition-all ${
                        videoUrl ? 'bg-transparent border-none' : 'border border-gray-800 bg-black shadow-inner'
                    }`}>
                        {videoUrl ? (
                            <ReactPlayer
                                url={videoUrl}
                                controls
                                width="100%"
                                height="100%"
                                style={{ borderRadius: '12px', overflow: 'hidden' }}
                                config={{
                                    file: {
                                        attributes: {
                                            style: {
                                                width: '100%',
                                                height: '100%',
                                                objectFit: 'cover',
                                            }
                                        }
                                    }
                                }}
                            />
                        ) : (
                            <div className="flex flex-col items-center justify-center gap-2 text-gray-600">
                                <div className="select-none text-5xl font-extrabold tracking-widest text-zinc-800">
                                    vevo
                                </div>
                                <div className="select-none text-[10px] font-semibold uppercase tracking-wider text-zinc-600">
                                    No Video Selected
                                </div>
                            </div>
                        )}
                    </div>

                    <div>
                        <div className="text-xs font-semibold text-gray-400">
                            Current version - N/A
                        </div>

                        <div className="mt-6 border-t border-gray-100 pt-6">
                            <h3 className="mb-4 text-base font-bold tracking-wide text-gray-800">
                                Assets
                            </h3>

                            {/* Asset: Video file */}
                            <div className="mb-5">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                    <span>Video file *</span>
                                    <span className="text-gray-300">|</span>
                                    <Upload
                                        accept="video/*"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            const isVideo =
                                                file.type.startsWith('video/');
                                            if (!isVideo) {
                                                return Upload.LIST_IGNORE;
                                            }
                                            const objectUrl =
                                                URL.createObjectURL(file);
                                            setVideoUrl(objectUrl);
                                            form.setFieldsValue({
                                                videoFile: {
                                                    file,
                                                    fileList: [
                                                        {
                                                            originFileObj: file,
                                                            uid: '1',
                                                            name: file.name,
                                                        },
                                                    ],
                                                },
                                            });
                                            return false;
                                        }}
                                    >
                                        <span className="cursor-pointer text-blue-500 transition-all hover:text-blue-600 hover:underline">
                                            Select Video
                                        </span>
                                    </Upload>
                                </div>
                                <div className="mt-1 break-all text-xs font-medium text-gray-500">
                                    {form.getFieldValue('videoFile')
                                        ?.fileList?.[0]?.name ? (
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {
                                                    form.getFieldValue(
                                                        'videoFile'
                                                    ).fileList[0].name
                                                }
                                            </span>
                                            <span className="text-gray-300">
                                                |
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setVideoUrl('');
                                                    form.setFieldsValue({
                                                        videoFile: null,
                                                    });
                                                }}
                                                className="cursor-pointer text-red-500 hover:text-red-700 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="font-normal italic text-red-500">
                                            Video has not been uploaded *
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Asset: Thumbnail */}
                            <div className="mb-5">
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                    <span>Thumbnail file *</span>
                                    <span className="text-gray-300">|</span>
                                    <Upload
                                        accept="image/*"
                                        showUploadList={false}
                                        beforeUpload={(file) => {
                                            const isImage =
                                                file.type.startsWith('image/');
                                            if (!isImage) {
                                                return Upload.LIST_IGNORE;
                                            }
                                            const objectUrl =
                                                URL.createObjectURL(file);
                                            setThumbnailUrl(objectUrl);
                                            form.setFieldsValue({
                                                thumbnailFile: {
                                                    file,
                                                    fileList: [
                                                        {
                                                            originFileObj: file,
                                                            uid: '1',
                                                            name: file.name,
                                                        },
                                                    ],
                                                },
                                            });
                                            return false;
                                        }}
                                    >
                                        <span className="cursor-pointer text-blue-500 transition-all hover:text-blue-600 hover:underline">
                                            Upload
                                        </span>
                                    </Upload>
                                </div>
                                <div className="mt-1 break-all text-xs font-medium text-gray-500">
                                    {form.getFieldValue('thumbnailFile')
                                        ?.fileList?.[0]?.name ? (
                                        <div className="flex items-center gap-2">
                                            <span>
                                                {
                                                    form.getFieldValue(
                                                        'thumbnailFile'
                                                    ).fileList[0].name
                                                }
                                            </span>
                                            <span className="text-gray-300">
                                                |
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setThumbnailUrl('');
                                                    form.setFieldsValue({
                                                        thumbnailFile: null,
                                                    });
                                                }}
                                                className="cursor-pointer text-red-500 hover:text-red-700 hover:underline"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    ) : (
                                        <span className="font-normal italic text-red-500">
                                            Thumbnail has not been uploaded *
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Asset: Captions and Subtitles */}
                            <div>
                                <div className="flex items-center gap-2 text-xs font-bold text-gray-800">
                                    <span>Captions and subtitles</span>
                                    <span className="text-gray-300">|</span>
                                    <span className="cursor-pointer text-blue-500 transition-all hover:text-blue-600 hover:underline">
                                        Manage
                                    </span>
                                </div>
                                <div className="mt-1 text-xs font-medium text-gray-500">
                                    0 caption files. 0 subtitle files.
                                </div>
                            </div>
                        </div>
                    </div>
                </Col>

                {/* Right Side: Metadata Fields Layout */}
                <Col span={16}>
                    {/* Title (Full Width) */}
                    <AppFormItem
                        name="videoTitle"
                        label={messages('releaseVideo.fields.videoTitle')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                            {
                                max: MAX_NAME_LENGTH,
                                message: messages('validation.stringMax', {
                                    max: MAX_NAME_LENGTH,
                                    field: messages(
                                        'releaseVideo.fields.videoTitle'
                                    ),
                                }),
                            },
                        ]}
                    >
                        <Input
                            placeholder="Add a title"
                            allowClear
                            showCount
                            maxLength={MAX_NAME_LENGTH}
                        />
                    </AppFormItem>

                    {/* Primary & Featured Artists */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <AppFormItem
                                name="primaryArtists"
                                label={messages(
                                    'releaseVideo.fields.primaryArtists'
                                )}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Select..."
                                    allowClear
                                    tokenSeparators={[',']}
                                />
                            </AppFormItem>
                        </Col>
                        <Col span={12}>
                            <AppFormItem
                                name="featuredArtists"
                                label={messages(
                                    'releaseVideo.fields.featuredArtists'
                                )}
                            >
                                <Select
                                    mode="tags"
                                    placeholder="Select..."
                                    allowClear
                                    tokenSeparators={[',']}
                                />
                            </AppFormItem>
                        </Col>
                    </Row>

                    {/* Genre (Full Width) */}
                    <AppFormItem
                        name="genres"
                        label={messages('releaseVideo.fields.genres')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.select'),
                            },
                        ]}
                    >
                        <Select
                            mode="tags"
                            placeholder="Genres"
                            allowClear
                            tokenSeparators={[',']}
                        />
                    </AppFormItem>

                    {/* Language & Explicit Dropdowns */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <AppFormItem
                                name="language"
                                label={messages('common.language')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.select'),
                                    },
                                ]}
                            >
                                <LanguageSelect
                                    placeholder="Select..."
                                    allowClear
                                />
                            </AppFormItem>
                        </Col>
                        <Col span={12}>
                            <AppFormItem
                                name="isExplicit"
                                label={messages(
                                    'releaseVideo.fields.isExplicit'
                                )}
                            >
                                <Select
                                    placeholder="Select..."
                                    options={[
                                        { value: false, label: 'No' },
                                        { value: true, label: 'Yes' },
                                    ]}
                                />
                            </AppFormItem>
                        </Col>
                    </Row>

                    {/* Contains AI Content & ISRC */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <AppFormItem
                                name="containsAiContent"
                                label={messages(
                                    'releaseVideo.fields.containsAiContent'
                                )}
                            >
                                <Select
                                    placeholder="Select..."
                                    options={[
                                        {
                                            value: 'undetermined',
                                            label: 'Undetermined',
                                        },
                                        { value: 'no', label: 'No' },
                                        { value: 'yes', label: 'Yes' },
                                    ]}
                                />
                            </AppFormItem>
                        </Col>
                        <Col span={12}>
                            <AppFormItem
                                name="isrc"
                                label={messages('releaseVideo.fields.isrc')}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input placeholder="Your ISRC" allowClear />
                            </AppFormItem>
                        </Col>
                    </Row>

                    {/* Ownership Subheader */}
                    <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold tracking-wide text-gray-800">
                        Ownership
                    </div>

                    {/* Content Provider & Repertoire Owner */}
                    <Row gutter={16}>
                        <Col span={12}>
                            <AppFormItem
                                name="contentProvider"
                                label={messages(
                                    'releaseVideo.fields.contentProvider'
                                )}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={messages(
                                        'releaseVideo.fields.contentProvider'
                                    )}
                                    allowClear
                                />
                            </AppFormItem>
                        </Col>
                        <Col span={12}>
                            <AppFormItem
                                name="repertoireOwner"
                                label={messages(
                                    'releaseVideo.fields.repertoireOwner'
                                )}
                                required
                                rules={[
                                    {
                                        required: true,
                                        message: messages('validation.input'),
                                    },
                                ]}
                            >
                                <Input
                                    placeholder={messages(
                                        'releaseVideo.fields.repertoireOwner'
                                    )}
                                    allowClear
                                />
                            </AppFormItem>
                        </Col>
                    </Row>

                    {/* Channel (Full Width) */}
                    <AppFormItem
                        name="channel"
                        label={messages('releaseVideo.fields.channel')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input
                            placeholder={messages(
                                'releaseVideo.fields.channel'
                            )}
                            allowClear
                        />
                    </AppFormItem>

                    {/* Keywords (Full Width) */}
                    <AppFormItem
                        name="keywords"
                        label={messages('common.keyword')}
                    >
                        <Select
                            mode="tags"
                            placeholder="Add keywords"
                            allowClear
                            tokenSeparators={[',']}
                        />
                    </AppFormItem>

                    {/* Description (Full Width) */}
                    <AppFormItem
                        name="description"
                        label={messages('common.description')}
                        required
                        rules={[
                            {
                                required: true,
                                message: messages('validation.input'),
                            },
                        ]}
                    >
                        <Input.TextArea
                            showCount
                            placeholder={messages('common.description')}
                            allowClear
                            autoSize={{ minRows: 4, maxRows: 6 }}
                        />
                    </AppFormItem>

                    {/* Is Made For Kids (Full Width Switch) */}
                    <div className="mt-4 flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50/50 p-3">
                        <span className="text-sm font-medium text-gray-600">
                            {messages('releaseVideo.fields.isMadeForKids')}
                        </span>
                        <AppFormItem
                            name="isMadeForKids"
                            valuePropName="checked"
                            noStyle
                        >
                            <AppSwitch />
                        </AppFormItem>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
