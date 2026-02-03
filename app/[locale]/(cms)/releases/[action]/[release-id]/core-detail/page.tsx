'use client';
import useModalStore from '@/hooks/use-modal';
import { ReleaseArtist } from '@/modules/release-artist/types';
import ReleaseDetailForm from '@/modules/releases/components/release-detail/release-detail-form';
import { useTranslations } from 'next-intl';

export default function CoreDetail() {
    return (
        <div>
            <ReleaseDetailForm />
        </div>
    );
}
