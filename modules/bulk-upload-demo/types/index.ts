// ── Bulk Upload Demo Types ──────────────────────────────────────────

export type JobStatus = 'pending' | 'uploading' | 'processing' | 'done';

export interface DraftTrack {
    id: string;
    filename: string;
    durationSec: number;
    sizeMB: number;
    status: JobStatus;
    storageKey?: string;
    file: File;
}

export interface DraftRelease {
    id: string; // unique id for each release in the queue
    title: string;
    artist: string;
    label: string;
    releaseDate: string; // ISO date string
    totalTracks: number;
    coverFile: File | null;
    coverUrl: string | null;
    tracks: DraftTrack[];
    jobStatus: JobStatus;
}

export interface FakeApiTrack {
    trackId: string;
    filename: string;
    durationSec: number;
    storageKey: string;
}

export interface FakeApiResponse {
    releaseId: string;
    coverUrl: string;
    tracks: FakeApiTrack[];
}
