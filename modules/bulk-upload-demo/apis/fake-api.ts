import type { DraftRelease, FakeApiResponse, FakeApiTrack } from '../types';

// ── Helpers ─────────────────────────────────────────────────────────

function uid(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function randomDelay(): number {
    return 800 + Math.random() * 400; // 800–1200 ms
}

// ── Fake API ────────────────────────────────────────────────────────

export function fakeCreateReleaseDraft(
    input: DraftRelease
): Promise<FakeApiResponse> {
    return new Promise((resolve) => {
        const releaseId = uid();

        const tracks: FakeApiTrack[] = input.tracks.map((t) => {
            const trackId = uid();
            return {
                trackId,
                filename: t.filename,
                durationSec: t.durationSec,
                storageKey: `releases/${releaseId}/tracks/${trackId}/${t.filename}`,
            };
        });

        const coverUrl = input.coverFile
            ? URL.createObjectURL(input.coverFile)
            : '';

        setTimeout(() => {
            resolve({ releaseId, coverUrl, tracks });
        }, randomDelay());
    });
}
