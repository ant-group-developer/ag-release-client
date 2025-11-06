'use client';

import { ArtistProvider } from '@/modules/artist/hooks/use-artist-context';
import ArtistDetailLayout from './artist-layout';

export default function ArtistDetailLayoutWrapper({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <ArtistProvider>
            <ArtistDetailLayout>{children}</ArtistDetailLayout>
        </ArtistProvider>
    );
}
