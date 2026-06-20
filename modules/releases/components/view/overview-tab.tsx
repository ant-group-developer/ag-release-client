import { cn } from '@/helpers/common';
import CodesSectionV2 from '@/modules/releases/components/release-detail/release-detail-form/form-section/codes-section-v2';
import GenreLanguageSectionV2 from '@/modules/releases/components/release-detail/release-detail-form/form-section/genre-language-v2';
import LegalNoticesSectionV2 from '@/modules/releases/components/release-detail/release-detail-form/form-section/legal-notices-v2';
import ReleaseConfigurationSectionV2 from '@/modules/releases/components/release-detail/release-detail-form/form-section/release-configuration-v2';
import {
    ReleaseDetailSchema,
    releaseDetailSchema,
} from '@/modules/releases/schemas';
import { ReleasesData } from '@/modules/releases/types';
import { zodResolver } from '@hookform/resolvers/zod';
import { ConfigProvider, Empty, Form, theme } from 'antd';
import { useTranslations } from 'next-intl';
import { PropsWithChildren, useEffect } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import MetadataExternalOverviewSection from './metadata-external-overview-section';
import ReleaseArtistsSection from './release-artists-section';
import ReleaseContributorsSection from './release-contributors-section';

type Props = {
    releaseData: ReleasesData;
};

type OverviewSectionCardProps = PropsWithChildren<{
    isEmpty?: boolean;
}>;

function OverviewSectionCard({
    children,
    isEmpty = false,
}: OverviewSectionCardProps) {
    const { token } = theme.useToken();

    return (
        <div
            className="rounded-lg p-6 shadow-sm"
            style={{ backgroundColor: token.colorBgContainer }}
        >
            {isEmpty ? (
                <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
            ) : (
                children
            )}
        </div>
    );
}

const noop = () => {};

export default function OverviewTab({ releaseData }: Props) {
    const messages = useTranslations();
    const { token } = theme.useToken();

    const formMethods = useForm<ReleaseDetailSchema>({
        resolver: zodResolver(releaseDetailSchema(messages)),
        mode: 'onChange',
        reValidateMode: 'onChange',
        defaultValues: {
            isInstrumental: false,
        },
    });

    const { reset } = formMethods;

    useEffect(() => {
        if (releaseData) {
            reset({
                ...(releaseData as any),
                isInstrumental: releaseData.isInstrumental ?? false,
            });
        }
    }, [releaseData, reset]);

    if (!releaseData) return null;

    const isHasMetadataExternal = Object.values(
        releaseData.metadataExternal ?? {}
    ).some((metadata) => !!metadata);

    const isHasArtist =
        releaseData?.releaseArtists && releaseData?.releaseArtists?.length > 0;
    const isHasContributors =
        releaseData?.releaseContributors &&
        releaseData?.releaseContributors?.length > 0;

    const isReadMode = true;
    const isCreateReleasePage = false;

    return (
        <FormProvider {...formMethods}>
            <ConfigProvider
                theme={{
                    token: {
                        colorTextDisabled: token.colorText,
                    },
                }}
            >
                <Form
                    className={cn(
                        'form-read-only-primary',
                        '[&_.ant-input]:!font-medium [&_.ant-picker-input_input]:!font-medium [&_.ant-radio-wrapper]:!font-medium [&_.ant-select-selection-item]:!font-medium'
                    )}
                    layout="horizontal"
                    labelCol={{ xl: 10, lg: 14, md: 24, sm: 24 }}
                    wrapperCol={{ xl: 14, lg: 10, md: 24, sm: 24 }}
                    labelAlign="left"
                    variant="underlined"
                >
                    <div className="flex flex-col gap-4 pb-4">
                        {isHasMetadataExternal && (
                            <OverviewSectionCard>
                                <MetadataExternalOverviewSection
                                    releaseData={releaseData}
                                />
                            </OverviewSectionCard>
                        )}
                        {isHasArtist && (
                            <OverviewSectionCard>
                                <ReleaseArtistsSection
                                    releaseData={releaseData}
                                />
                            </OverviewSectionCard>
                        )}
                        {isHasContributors && (
                            <OverviewSectionCard>
                                <ReleaseContributorsSection
                                    releaseData={releaseData}
                                />
                            </OverviewSectionCard>
                        )}

                        <OverviewSectionCard>
                            <ReleaseConfigurationSectionV2
                                debouncedUpdate={noop}
                                isReadMode={isReadMode}
                                isCreateReleasePage={isCreateReleasePage}
                            />
                        </OverviewSectionCard>

                        <OverviewSectionCard>
                            <CodesSectionV2
                                debouncedUpdate={noop}
                                isReadMode={isReadMode}
                                isCreateReleasePage={isCreateReleasePage}
                            />
                        </OverviewSectionCard>

                        <OverviewSectionCard>
                            <GenreLanguageSectionV2
                                debouncedUpdate={noop}
                                isReadMode={isReadMode}
                                isCreateReleasePage={isCreateReleasePage}
                            />
                        </OverviewSectionCard>

                        <OverviewSectionCard>
                            <LegalNoticesSectionV2
                                debouncedUpdate={noop}
                                isReadMode={isReadMode}
                                isCreateReleasePage={isCreateReleasePage}
                            />
                        </OverviewSectionCard>
                    </div>
                </Form>
            </ConfigProvider>
        </FormProvider>
    );
}
