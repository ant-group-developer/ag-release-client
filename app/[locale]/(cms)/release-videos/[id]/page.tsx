'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { Link } from '@/i18n/routing';
import ReleaseVideoForm from '@/modules/release-video/components/form/release-video-form';
import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Breadcrumb, Spin } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';

import { APP_ROUTES } from '@/enums/routes';

export default function EditReleaseVideo() {
    const messages = useTranslations();
    const params = useParams();
    const id = params?.id as string;

    const { releaseData, isLoading } = useGetDetailRelease(id);

    const breadcrumbItems = [
        {
            title: (
                <Link href={APP_ROUTES.RELEASE_VIDEOS}>
                    {messages('releaseVideo.routeLabel')}
                </Link>
            ),
        },
        {
            title: releaseData?.title || messages('common.detail'),
        },
    ];

    return (
        <AppPageWrapper>
            <div className="mx-auto flex w-full flex-col px-8 py-4">
                <Breadcrumb items={breadcrumbItems} className="!py-4" />
                {isLoading ? (
                    <div className="flex h-64 items-center justify-center">
                        <Spin size="large" />
                    </div>
                ) : (
                    <ReleaseVideoForm dataEdit={releaseData} />
                )}
            </div>
        </AppPageWrapper>
    );
}
