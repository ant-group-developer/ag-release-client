import { formattedDate } from '@/helpers/common';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useTranslations } from 'next-intl';
import MetadataInfoItem from '../metadata-info/metadata-info-item';

type Props = {};

export default function ReviewProgress({}: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);

    return (
        <div>
            <div className="grid grid-cols-3 gap-2">
                <div>
                    <MetadataInfoItem label={messages('releases.releaseDate')}>
                        <p className="pt-1">
                            {formValues.releaseDate
                                ? formattedDate(formValues.releaseDate)
                                : messages('common.notAvailable')}
                        </p>
                    </MetadataInfoItem>
                </div>

                <div>
                    <MetadataInfoItem label={messages('releases.releaseTime')}>
                        <p className="pt-1">
                            {formValues.releaseTime
                                ? formValues.releaseTime
                                : messages('common.notAvailable')}
                        </p>
                    </MetadataInfoItem>
                </div>

                <div>
                    <MetadataInfoItem label={messages('timezone.label')}>
                        <p className="pt-1">{formValues?.timeZone?.name}</p>
                    </MetadataInfoItem>
                </div>

                {/* <div className="col-span-3">
                    <MetadataInfoItem label={messages('common.region')}>
                        {formValues?.releaseTerritory?.distributeWorldwide ? (
                            <div className="inline-block rounded border px-4 py-2 text-base font-semibold">
                                {messages('distribute.wordWide')}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 pt-1">
                                    <span className="font-medium text-gray-700">
                                        {formValues?.releaseTerritory
                                            ?.distributionType ===
                                        'distribute_only_in'
                                            ? messages('distribute.onlyIn')
                                            : messages(
                                                  'distribute.everyWhereExcept'
                                              )}
                                    </span>
                                </div>
                                <div className="mt-1 flex flex-wrap gap-2">
                                    {Array.isArray(
                                        formValues?.releaseTerritory
                                            ?.selectedCountries
                                    ) &&
                                    formValues.releaseTerritory
                                        .selectedCountries.length > 0 ? (
                                        formValues.releaseTerritory.selectedCountries.map(
                                            (country: any, idx: number) => (
                                                <Tag
                                                    key={
                                                        country.value ||
                                                        country.code ||
                                                        idx
                                                    }
                                                >
                                                    {country.label ||
                                                        country.name ||
                                                        country}
                                                </Tag>
                                            )
                                        )
                                    ) : (
                                        <span className="italic text-gray-400">
                                            Chưa có quốc gia
                                        </span>
                                    )}
                                </div>
                            </div>
                        )}
                    </MetadataInfoItem>
                </div> */}
            </div>
        </div>
    );
}
