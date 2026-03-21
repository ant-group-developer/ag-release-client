import { ReleaseArtist } from '@/modules/release-artist/types';
import { ReleaseContributor } from '@/modules/release-contributor/types';
import type { ReleaseFormStoreData } from '@/modules/releases/hooks/release-form-store';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { useTranslations } from 'next-intl';
import ArtistItem from './artist-item';
import MetadataInfoItem from './metadata-info-item';

type Props = {};

export default function MetadataInfo({}: Props) {
    const messages = useTranslations();
    const formValue = useReleaseFormStore((state) => state.formValues);
    const { releaseData } = useGetDetailRelease(formValue?.id as string);

    const getFieldValue = (fieldPath: string) => {
        const value = (releaseData as any)[fieldPath] || '';

        switch (fieldPath) {
            case 'title':
            case 'version':
            case 'upc':
            case 'catalogId':
            case 'releaseDate':
            case 'releaseOriginalDate':
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
                return `${releaseData.cLineYear ?? ''}  ${releaseData.cLineOwner ?? ''}`.trim();

            case 'pLineOwner':
                return `${releaseData.pLineYear ?? ''}  ${releaseData.pLineOwner ?? ''}`.trim();

            default:
                return value;
        }
    };

    const renderField = (
        fieldPath: keyof ReleaseFormStoreData | string,
        isRequired: boolean = false
    ) => {
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
                {/* {error && (
                    <CircleAlert className="text-red-500" size={SIZE_ICON} />
                )} */}
            </div>
        );
    };

    return (
        <div className="m-auto grid w-full grid-cols-2 gap-4">
            {/* <p className="font-semibold">MetaData</p> */}
            {/* <div className="my-1 rounded-lg bg-main p-4 dark:bg-zinc-900">
                <p className="text-base font-medium">
                    {messages('common.coreInfo')}
                </p>
            </div> */}

            <MetadataInfoItem label={messages('release.name')}>
                {renderField('title', true)}
            </MetadataInfoItem>

            <MetadataInfoItem label={messages('release.version')}>
                {renderField('version')}
            </MetadataInfoItem>

            <MetadataInfoItem
                className="col-span-2"
                label={messages('artist.artists')}
            >
                {releaseData?.releaseArtists?.map(
                    (releaseArtist: ReleaseArtist, index: number) => (
                        <ArtistItem
                            key={releaseArtist.id}
                            data={{
                                artist: releaseArtist?.artist,
                                // role: releaseArtist?.artistRole,
                            }}
                        />
                    )
                )}
            </MetadataInfoItem>
            <MetadataInfoItem
                className="col-span-2"
                label={messages('common.contributors')}
            >
                {releaseData?.releaseContributors?.map(
                    (item: ReleaseContributor, index: number) => (
                        <ArtistItem
                            key={item.id}
                            data={{
                                artist: item?.artist,
                                role: item?.artistRole,
                            }}
                        />
                    )
                )}
            </MetadataInfoItem>

            <MetadataInfoItem label={messages('genres.primary')}>
                {renderField('primaryGenreId', true)}
            </MetadataInfoItem>
            <MetadataInfoItem label={messages('common.subGenres')}>
                {renderField('subGenreId')}
            </MetadataInfoItem>

            <MetadataInfoItem label={'Label'}>
                {renderField('labelId')}
            </MetadataInfoItem>

            <MetadataInfoItem label={'UPC'}>
                {renderField('upc')}
            </MetadataInfoItem>

            <MetadataInfoItem label={'ID catalog'}>
                {renderField('catalogId')}
            </MetadataInfoItem>

            <MetadataInfoItem label={messages('release.type')}>
                {renderField('type', true)}
            </MetadataInfoItem>

            <MetadataInfoItem label={messages('release.releaseOriginalDate')}>
                {renderField('releaseOriginalDate')}
            </MetadataInfoItem>

            <MetadataInfoItem label={`© ${messages('common.copyRight')}`}>
                {renderField('cLineOwner', true)}
            </MetadataInfoItem>

            <MetadataInfoItem label={`℗ ${messages('common.copyRight')}`}>
                {renderField('pLineOwner', true)}
            </MetadataInfoItem>

            <MetadataInfoItem label={`${messages('common.language')} metadata`}>
                {renderField('metadataLanguageId', true)}
            </MetadataInfoItem>
        </div>
    );
}
