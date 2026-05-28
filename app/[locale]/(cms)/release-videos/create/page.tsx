'use client';

import AppPageWrapper from '@/components/ant-music/app-page-wrapper';
import { Link } from '@/i18n/routing';
import ReleaseVideoForm from '@/modules/release-video/components/form/release-video-form';
import { Breadcrumb } from 'antd';
import { useTranslations } from 'next-intl';

import { APP_ROUTES } from '@/enums/routes';

export default function CreateReleaseVideo() {
    const messages = useTranslations();

    const breadcrumbItems = [
        {
            title: (
                <Link href={APP_ROUTES.RELEASE_VIDEOS}>
                    {messages('releaseVideo.title')}
                </Link>
            ),
        },
        {
            title: messages('common.create'),
        },
    ];

    return (
        <AppPageWrapper>
            <div className="mx-auto flex w-full flex-col px-8 pb-4">
                <Breadcrumb items={breadcrumbItems} className="!py-4" />
                <ReleaseVideoForm />
            </div>
        </AppPageWrapper>
    );
}
