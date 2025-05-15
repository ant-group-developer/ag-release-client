export interface TopListRowData {
    id?: number;
    image?: string;
    title: string;
    artist?: string;
    plays?: number;
}

export interface AlbumData {
    id: number;
    title: string;
    artist: string;
    date: string;
    tracks: number;
    image: string;
    status: string;
    plays: number;
}
