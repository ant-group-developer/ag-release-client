/**
 * Calculate start and end byte offsets for a given partNumber (1-indexed)
 */
export function getPartBounds(
    partNumber: number,
    partSize: number,
    fileSize: number
): { start: number; end: number } {
    const start = (partNumber - 1) * partSize;
    const end = Math.min(start + partSize, fileSize);
    return { start, end };
}

/**
 * Slice a file/blob into a specific chunk based on partNumber (1-indexed)
 */
export function sliceFilePart(
    file: File | Blob,
    partNumber: number,
    partSize: number
): Blob {
    const { start, end } = getPartBounds(partNumber, partSize, file.size);
    return file.slice(start, end);
}

/**
 * Generate a lightweight fingerprint of a file without hashing the entire content
 */
export function createFileFingerprint(file: File): string {
    return `${file.name}:${file.size}:${file.lastModified}:${file.type}`;
}

/**
 * Format upload speed in bytes per second to human-readable string (e.g. 12.5 MB/s)
 */
export function formatUploadSpeed(bytesPerSecond: number): string {
    if (!bytesPerSecond || bytesPerSecond <= 0) return '0 B/s';
    const k = 1024;
    const sizes = ['B/s', 'KB/s', 'MB/s', 'GB/s'];
    const i = Math.floor(Math.log(bytesPerSecond) / Math.log(k));
    const formatted = parseFloat((bytesPerSecond / Math.pow(k, i)).toFixed(1));
    return `${formatted} ${sizes[i] || 'B/s'}`;
}

/**
 * Format remaining seconds to human-readable duration
 */
export function formatRemainingTime(
    seconds: number,
    locale: string = 'vi'
): string {
    if (!seconds || seconds <= 0 || !Number.isFinite(seconds)) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);

    const isVi = locale === 'vi';

    if (h > 0) {
        return isVi
            ? `${h} giờ ${m > 0 ? `${m} phút` : ''}`.trim()
            : `${h}h ${m > 0 ? `${m}m` : ''}`.trim();
    }
    if (m > 0) {
        return isVi
            ? `${m} phút ${s > 0 ? `${s} giây` : ''}`.trim()
            : `${m}m ${s > 0 ? `${s}s` : ''}`.trim();
    }
    return isVi ? `${s} giây` : `${s}s`;
}

