import { SIZE_ICON } from '@/constants/common';
import { cn, getLanguageLabel } from '@/helpers/common';
import type { ReleaseFormStoreData } from '@/modules/releases/hooks/release-form-store';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import MetadataInfoItem from '../tracks-info/metadata-info-item';

type Props = {};

export default function MetadataInfo({}: Props) {
    const messages = useTranslations();
    const formValue = useReleaseFormStore((state) => state.formValues);
    const formErrors = useReleaseFormStore((state) => state.validationErrors);

    const getFieldError = (fieldPath: keyof ReleaseFormStoreData | string) => {
        return formErrors.find((error) => error.path.join('.') === fieldPath);
    };

    const renderField = (
        label: string,
        fieldPath: keyof ReleaseFormStoreData | string,
        isRequired: boolean = false
    ) => {
        console.log('🚀 ~ MetadataInfo ~ fieldPath:', fieldPath);
        const error = getFieldError(fieldPath);
        let value = (formValue as any)[fieldPath] || '';

        if (
            fieldPath === 'metaDataLanguage' ||
            fieldPath === 'metadataLanguageId'
        ) {
            value = getLanguageLabel(value);
        }

        if (
            (fieldPath === 'cLineOwner' || fieldPath === 'pLineOwner') &&
            value
        ) {
            value = `${value.length > 4 ? value : ''}`.trim();
        }

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
            <p className="font-semibold">MetaData</p>
            <div className="my-1 rounded-lg bg-card-bg p-4">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div>
            <div className="grid grid-cols-1 gap-1">
                <MetadataInfoItem label={messages('releases.name')}>
                    {renderField(messages('releases.name'), 'title', true)}
                    {renderField(messages('releases.version'), 'version')}
                </MetadataInfoItem>

                <MetadataInfoItem label={messages('common.artist')}>
                    {(formValue.releaseArtists?.length === 0 ||
                        !formValue.releaseArtists) && (
                        <p className="font-semibold text-red-500"></p>
                    )}
                    {formValue.releaseArtists?.map(
                        (artist: any, index: number) => (
                            <div key={index} className="flex justify-between">
                                <div>
                                    <p
                                        className={cn('font-semibold', {
                                            'text-red-500':
                                                getFieldError('releaseArtists'),
                                        })}
                                    >
                                        {artist.name} {index === 0 && '*'}
                                    </p>
                                    <p className="text-gray-500">
                                        {/* {artist.role} */} Role
                                    </p>
                                </div>
                                {getFieldError('releaseArtists') && (
                                    <CircleAlert
                                        className="text-red-500"
                                        size={SIZE_ICON}
                                    />
                                )}
                            </div>
                        )
                    )}
                </MetadataInfoItem>

                <MetadataInfoItem label={messages('genres.primary')}>
                    {renderField(
                        messages('formFields.tracks.genres'),
                        'primaryGenreId',
                        true
                    )}
                    {renderField(
                        messages('formFields.tracks.subGenres'),
                        'subGenreId'
                    )}
                </MetadataInfoItem>

                <MetadataInfoItem label={messages('common.language')}>
                    {renderField(
                        messages('formFields.tracks.metadataLanguage'),
                        'metadataLanguageId',
                        true
                    )}
                </MetadataInfoItem>

                <MetadataInfoItem label={'Label'}>
                    {renderField('Label', 'labelId')}
                </MetadataInfoItem>

                <MetadataInfoItem label={'UPC'}>
                    {renderField('UPC', 'upc')}
                </MetadataInfoItem>

                <MetadataInfoItem label={'ID category'}>
                    {renderField('ID Category', 'catalogId')}
                </MetadataInfoItem>

                <MetadataInfoItem label={messages('common.copyRight')}>
                    {renderField('Bản quyền tác phẩm', 'cLineOwner', true)}
                    {renderField('Bản quyền ghi âm', 'pLineOwner', true)}
                </MetadataInfoItem>
            </div>
        </div>
    );
}
