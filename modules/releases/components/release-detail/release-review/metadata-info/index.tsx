import { SIZE_ICON } from '@/constants/common';
import { ReleaseArtist } from '@/modules/release-artist/types';
import type { ReleaseFormStoreData } from '@/modules/releases/hooks/release-form-store';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { CircleAlert } from 'lucide-react';
import { useTranslations } from 'next-intl';
import ArtistItem from './artist-item';
import MetadataInfoItem from './metadata-info-item';

type Props = {};

export default function MetadataInfo({}: Props) {
    const messages = useTranslations();
    const formValue = useReleaseFormStore((state) => state.formValues);
    const { releaseData } = useGetDetailRelease(formValue?.id as string);
    const formErrors = useReleaseFormStore((state) => state.validationErrors);

    const getFieldError = (fieldPath: keyof ReleaseFormStoreData | string) => {
        return formErrors.find((error) => error.path.join('.') === fieldPath);
    };

    const getFieldValue = (fieldPath: string) => {
        const value = (releaseData as any)[fieldPath] || '';

        switch (fieldPath) {
            case 'title':
            case 'version':
            case 'upc':
            case 'catalogId':
            case 'releaseDate':
            case 'releaseTime':
                return value;

            case 'primaryGenreId':
                return releaseData.primaryGenre?.name || value;

            case 'subGenreId':
                return releaseData.subGenre?.name || value;

            case 'labelId':
                return releaseData.label?.name || value;

            case 'metadataLanguageId':
                return (
                    releaseData.releaseLanguage?.metadataLanguage?.name || value
                );

            case 'type':
                return releaseData.albumFormat.name || value;

            case 'cLineOwner':
            case 'pLineOwner':
                return value.length > 4 ? value.trim() : '';

            default:
                return value;
        }
    };

    const renderField = (
        fieldPath: keyof ReleaseFormStoreData | string,
        isRequired: boolean = false
    ) => {
        const error = getFieldError(fieldPath);
        const value = getFieldValue(fieldPath);

        return (
            <div className="flex justify-between">
                <div>
                    {!value && (
                        <div>
                            {isRequired ? (
                                <p className="text-red-500">
                                    {messages('common.required')}
                                </p>
                            ) : (
                                <p className="text-gray-500">
                                    {messages('common.optional')}
                                </p>
                            )}
                        </div>
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
        <div className="space-y-2">
            <p className="font-semibold">MetaData</p>
            <div className="my-1 rounded-lg bg-zinc-100 p-4">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={messages('releases.name')}>
                    {renderField('title', true)}
                </MetadataInfoItem>
                <MetadataInfoItem label={messages('releases.version')}>
                    {renderField('version')}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={messages('common.artist')}>
                    {releaseData?.releaseArtists?.map(
                        (releaseArtist: ReleaseArtist, index: number) => (
                            <ArtistItem
                                key={index}
                                data={{
                                    artist: releaseArtist?.artist,
                                    role: releaseArtist?.artistRole,
                                }}
                            />
                        )
                    )}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={messages('genres.primary')}>
                    {renderField('primaryGenreId', true)}
                </MetadataInfoItem>
                <MetadataInfoItem label={messages('common.subGenres')}>
                    {renderField('subGenreId')}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem
                    label={`${messages('common.language')} metadata`}
                >
                    {renderField('metadataLanguageId', true)}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={'Label'}>
                    {renderField('labelId')}
                </MetadataInfoItem>

                <MetadataInfoItem label={'UPC'}>
                    {renderField('upc')}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={'ID catalog'}>
                    {renderField('catalogId')}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={messages('releases.releaseDate')}>
                    {renderField('releaseDate', true)}
                </MetadataInfoItem>
                <MetadataInfoItem label={messages('releases.releaseTime')}>
                    {renderField('releaseTime', true)}
                </MetadataInfoItem>
            </div>

            <div>
                <MetadataInfoItem label={messages('releases.type')}>
                    {renderField('type', true)}
                </MetadataInfoItem>
            </div>

            <div className="grid grid-cols-2 gap-2">
                <MetadataInfoItem label={`© ${messages('common.copyRight')}`}>
                    {renderField('cLineOwner', true)}
                </MetadataInfoItem>
                <MetadataInfoItem label={`℗ ${messages('common.copyRight')}`}>
                    {renderField('pLineOwner', true)}
                </MetadataInfoItem>
            </div>
        </div>
    );
}
