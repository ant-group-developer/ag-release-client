import { SIZE_ICON } from '@/constants/common';
import { cn } from '@/helpers/tailwind';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { ReleaseFormValuesData } from '@/modules/releases/types';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';

type Props = {};

export default function MetadataInfo({}: Props) {
    const messages = useTranslations();
    const formValue = useReleaseFormStore((state) => state.formValues);
    const formErrors = useReleaseFormStore((state) => state.validationErrors);

    const getFieldError = (fieldPath: string) => {
        return formErrors.find((error) => error.path.join('.') === fieldPath);
    };

    const renderField = (
        label: string,
        fieldPath: keyof ReleaseFormValuesData,
        isRequired: boolean = false
    ) => {
        const error = getFieldError(fieldPath);
        const value = formValue[fieldPath] || '';

        return (
            <div className="flex justify-between">
                <div>
                    <p
                        className={cn('font-semibold', {
                            'text-red-500': error,
                        })}
                    >
                        {label} {isRequired && '*'}
                    </p>
                    {!value && (
                        <p className="text-gray-500">
                            {isRequired ? 'Bắt buộc' : 'Tuỳ chọn'}
                        </p>
                    )}
                    {value && <p className="mt-1">{value}</p>}
                </div>
                {error && (
                    <CircleAlert className="text-red-500" size={SIZE_ICON} />
                )}
            </div>
        );
    };

    return (
        <div>
            <p className="text-lg font-medium">MetaData</p>
            <div className="my-1 rounded-lg bg-card-bg p-4">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div>
            <div className="grid grid-cols-1 gap-1">
                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">
                        {messages('releases.name')}
                    </span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField(
                            messages('releases.name'),
                            'nameRelease',
                            true
                        )}
                        {renderField(messages('releases.version'), 'version')}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">
                        {' '}
                        {messages('common.artist')}{' '}
                    </span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {formValue.artists?.length === 0 && (
                            <p className="font-semibold text-red-500"></p>
                        )}
                        {formValue.artists?.map((artist, index) => (
                            <div key={index} className="flex justify-between">
                                <div>
                                    <p
                                        className={cn('font-semibold', {
                                            'text-red-500':
                                                getFieldError('artists'),
                                        })}
                                    >
                                        {artist.name} {index === 0 && '*'}
                                    </p>
                                    <p className="text-gray-500">
                                        {artist.role}
                                    </p>
                                </div>
                                {getFieldError('artists') && (
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Thể loại</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField('Thể loại chính', 'genres', true)}
                        {renderField('Thể loại phụ', 'subGenres')}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Ngôn ngữ</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField(
                            'Ngôn ngữ metadata',
                            'metaDataLanguage',
                            true
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Label</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField('Label', 'label')}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">UPC</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField('UPC', 'upc')}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">ID danh mục</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField('ID danh mục', 'catalogId')}
                    </div>
                </div>

                <div className="grid grid-cols-6 rounded-lg bg-card-bg p-4">
                    <span className="col-span-2 font-medium">Bản quyền</span>
                    <div className="col-span-4 flex flex-col gap-2">
                        {renderField(
                            'Năm cấp bản quyền tác phẩm',
                            'pLineYear',
                            true
                        )}
                        {renderField(
                            'Năm cấp bản quyền ghi âm',
                            'cLineYear',
                            true
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
