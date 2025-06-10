'use client';
import ReleaseSchedulingForm from '@/modules/release-detail/release-scheduling/form';
import ReleaseSchedulingTable from '@/modules/release-detail/release-scheduling/table';

export default function Schedule() {
    const fakeReleaseSchedulingData = [
        {
            key: '1',
            track: 'Summer Breeze - Instrumental',
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '2',
            track: 'Midnight Serenade - Remix',
            priceCode: '1.29',
            tikTokPolicy: 'Blocked',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Content ID',
        },
        {
            key: '3',
            track: 'Urban Pulse - Radio Edit',
            priceCode: '0.69',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '4',
            track: 'Forest Whispers - Acoustic',
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Content ID',
        },
        {
            key: '5',
            track: 'Digital Dream - Extended Mix',
            priceCode: '1.29',
            tikTokPolicy: 'Blocked',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '6',
            track: 'Ocean Waves - Chillout',
            priceCode: '0.69',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '7',
            track: 'Starlight Rendezvous - Live',
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Content ID',
        },
        {
            key: '8',
            track: 'Golden Hour - Original',
            priceCode: '1.29',
            tikTokPolicy: 'Blocked',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '9',
            track: 'Echoes in Time - Dub',
            priceCode: '0.69',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Content ID',
        },
        {
            key: '10',
            track: 'Crimson Sky - Ballad',
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '11',
            track: 'Digital Dream - Extended Mix',
            priceCode: '1.29',
            tikTokPolicy: 'Blocked',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '12',
            track: 'Ocean Waves - Chillout',
            priceCode: '0.69',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '13',
            track: 'Starlight Rendezvous - Live',
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Content ID',
        },
        {
            key: '14',
            track: 'Golden Hour - Original',
            priceCode: '1.29',
            tikTokPolicy: 'Blocked',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Standard License',
        },
        {
            key: '15',
            track: 'Echoes in Time - Dub',
            priceCode: '0.69',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Monetized',
            youtubePolicy: 'Content ID',
        },
        {
            key: '16',
            track: 'Crimson Sky - Ballad',
            priceCode: '0.99',
            tikTokPolicy: 'Allowed',
            facebookPolicy: 'Not Monetized',
            youtubePolicy: 'Standard License',
        },
    ];

    return (
        <div>
            <ReleaseSchedulingForm />
            <ReleaseSchedulingTable dataSource={fakeReleaseSchedulingData} />
        </div>
    );
}
