import { ArtistRoleData } from '@/modules/artist-role/types';
import { ArtistData } from '@/modules/artist/types';
import { Avatar } from 'antd';

interface ArtistItemProps {
    data: {
        artist: ArtistData | undefined;
        role?: ArtistRoleData | undefined;
    };
}

export default function ArtistItem({ data }: ArtistItemProps) {
    const { artist, role } = data;
    const artistName = artist?.name || '';
    const firstLetter = artistName.charAt(0).toUpperCase();

    return (
        <div className="flex items-center gap-3 py-1">
            <Avatar size={32} src={artist?.picture}>
                {firstLetter}
            </Avatar>
            <div className="flex-1">
                <p className="text-sm">
                    <span className="font-semibold">{artistName}</span>{' '}
                    {role && <span>{role?.name}</span>}
                </p>
            </div>
        </div>
    );
}
