import axios from 'axios';
import { bucketApi } from '../apis/bucket-api';
import { UploadedPart } from '../types/data';
import { getPartBounds, sliceFilePart } from '../utils/multipart-file';

export interface MultipartUploadProgress {
    loaded: number;
    total: number;
    percent: number;
    speed: number; // bytes per second
    completedParts: number;
    partCount: number;
}

export interface MultipartUploadOptions {
    file: File;
    fileId: string;
    partSize: number;
    partCount: number;
    existingParts?: UploadedPart[];
    concurrency?: number;
    presignBatchSize?: number;
    signal?: AbortSignal;
    onProgress?: (progress: MultipartUploadProgress) => void;
}

const DEFAULT_CONCURRENCY = 3;
const DEFAULT_PRESIGN_BATCH_SIZE = 10;
const MAX_PART_RETRIES = 3;
const RETRY_DELAYS = [1000, 2000, 4000]; // 1s, 2s, 4s

const sleep = (ms: number, signal?: AbortSignal): Promise<void> =>
    new Promise((resolve, reject) => {
        if (signal?.aborted) {
            return reject(new DOMException('Upload aborted', 'AbortError'));
        }
        const timer = setTimeout(() => {
            resolve();
        }, ms);
        signal?.addEventListener(
            'abort',
            () => {
                clearTimeout(timer);
                reject(new DOMException('Upload aborted', 'AbortError'));
            },
            { once: true }
        );
    });

/**
 * Upload a large file in parallel parts to Cloudflare R2 presigned URLs.
 * Logic: Xin trước presigned URLs cho một lô nhiều partNumber, sau đó PUT các chunk lên R2 theo concurrency.
 */
export async function uploadMultipartFile(
    options: MultipartUploadOptions
): Promise<Array<{ partNumber: number; eTag: string }>> {
    const {
        file,
        fileId,
        partSize,
        partCount,
        existingParts = [],
        concurrency = DEFAULT_CONCURRENCY,
        presignBatchSize = DEFAULT_PRESIGN_BATCH_SIZE,
        signal,
        onProgress,
    } = options;

    if (signal?.aborted) {
        throw new DOMException('Upload aborted', 'AbortError');
    }

    const completedMap = new Map<number, { partNumber: number; eTag: string }>();
    const partBytesLoaded = new Map<number, number>();

    // Register existing parts
    for (const part of existingParts) {
        if (part.partNumber >= 1 && part.partNumber <= partCount && part.eTag) {
            completedMap.set(part.partNumber, {
                partNumber: part.partNumber,
                eTag: part.eTag.replace(/^"|"$/g, '').trim(),
            });
            const { start, end } = getPartBounds(
                part.partNumber,
                partSize,
                file.size
            );
            partBytesLoaded.set(part.partNumber, end - start);
        }
    }

    // Prepare queue of part numbers that need to be uploaded
    const queue: number[] = [];
    for (let p = 1; p <= partCount; p++) {
        if (!completedMap.has(p)) {
            queue.push(p);
        }
    }

    // Speed tracking
    const startTime = Date.now();
    let lastSampleTime = startTime;
    let lastSampleLoaded = 0;
    let currentSpeed = 0;

    const emitProgress = () => {
        let totalLoaded = 0;
        partBytesLoaded.forEach((bytes) => {
            totalLoaded += bytes;
        });
        totalLoaded = Math.min(totalLoaded, file.size);

        const now = Date.now();
        const timeDiff = (now - lastSampleTime) / 1000;
        if (timeDiff >= 0.5) {
            const loadedDiff = totalLoaded - lastSampleLoaded;
            currentSpeed = Math.max(0, Math.round(loadedDiff / timeDiff));
            lastSampleTime = now;
            lastSampleLoaded = totalLoaded;
        }

        const percent =
            file.size > 0
                ? Math.min(100, Math.floor((totalLoaded / file.size) * 100))
                : 0;

        onProgress?.({
            loaded: totalLoaded,
            total: file.size,
            percent,
            speed: currentSpeed,
            completedParts: completedMap.size,
            partCount,
        });
    };

    // Emit initial progress
    emitProgress();

    // Helper: Xin presigned URL cho 1 part kèm retry
    const fetchPresignedUrl = async (partNumber: number): Promise<string> => {
        let lastErr: any = null;
        for (let attempt = 0; attempt <= MAX_PART_RETRIES; attempt++) {
            if (signal?.aborted) {
                throw new DOMException('Upload aborted', 'AbortError');
            }
            try {
                const res = await bucketApi.presignMultipartPart(
                    fileId,
                    partNumber
                );
                return res.urlUpload;
            } catch (err: any) {
                lastErr = err;
                if (signal?.aborted || err?.name === 'AbortError') {
                    throw new DOMException('Upload aborted', 'AbortError');
                }
                if (attempt < MAX_PART_RETRIES) {
                    const delay = RETRY_DELAYS[attempt] || 1000;
                    await sleep(delay, signal);
                }
            }
        }
        throw (
            lastErr ||
            new Error(`Failed to presign part ${partNumber} after retries`)
        );
    };

    // Xử lý theo từng lô: Xin nhiều partNumber cùng lúc -> Sau đó PUT theo concurrency
    while (queue.length > 0) {
        if (signal?.aborted) {
            throw new DOMException('Upload aborted', 'AbortError');
        }

        // 1. Lấy một lô partNumber (mặc định 10 part)
        const batchPartNumbers = queue.splice(0, presignBatchSize);

        // 2. Xin presigned URLs cho tất cả các partNumber trong lô trong 1 request duy nhất (Batch Presign)
        const presignedMap = new Map<number, string>();
        let presignSuccess = false;
        let presignErr: any = null;

        for (let attempt = 0; attempt <= MAX_PART_RETRIES; attempt++) {
            if (signal?.aborted) {
                throw new DOMException('Upload aborted', 'AbortError');
            }
            try {
                const batchRes = await bucketApi.presignMultipartParts(
                    fileId,
                    batchPartNumbers
                );
                batchRes.parts.forEach((item) => {
                    presignedMap.set(item.partNumber, item.urlUpload);
                });
                presignSuccess = true;
                break;
            } catch (err: any) {
                presignErr = err;
                if (signal?.aborted || err?.name === 'AbortError') {
                    throw new DOMException('Upload aborted', 'AbortError');
                }
                if (attempt < MAX_PART_RETRIES) {
                    const delay = RETRY_DELAYS[attempt] || 1000;
                    await sleep(delay, signal);
                }
            }
        }

        if (!presignSuccess) {
            throw (
                presignErr ||
                new Error(
                    `Failed to batch presign parts: ${batchPartNumbers.join(', ')}`
                )
            );
        }

        if (signal?.aborted) {
            throw new DOMException('Upload aborted', 'AbortError');
        }

        // 3. PUT các chunk lên R2 theo concurrency (mặc định 3 worker chạy đồng thời)
        const batchQueue = [...batchPartNumbers];

        const uploadBatchWorker = async (): Promise<void> => {
            while (batchQueue.length > 0) {
                if (signal?.aborted) {
                    throw new DOMException('Upload aborted', 'AbortError');
                }

                const partNumber = batchQueue.shift();
                if (partNumber === undefined) break;

                const { start, end } = getPartBounds(
                    partNumber,
                    partSize,
                    file.size
                );
                const chunk = sliceFilePart(file, partNumber, partSize);

                let success = false;
                let lastError: any = null;
                let currentUrl = presignedMap.get(partNumber);

                for (let attempt = 0; attempt <= MAX_PART_RETRIES; attempt++) {
                    if (signal?.aborted) {
                        throw new DOMException('Upload aborted', 'AbortError');
                    }

                    try {
                        if (!currentUrl) {
                            currentUrl = await fetchPresignedUrl(partNumber);
                        }

                        // PUT chunk trực tiếp lên R2
                        const response = await axios.put(currentUrl, chunk, {
                            signal,
                            headers: {
                                'Content-Type':
                                    file.type || 'application/octet-stream',
                            },
                            onUploadProgress: (event) => {
                                if (event.loaded) {
                                    partBytesLoaded.set(
                                        partNumber,
                                        Math.min(event.loaded, end - start)
                                    );
                                    emitProgress();
                                }
                            },
                        });

                        // Trích xuất ETag
                        const rawETag =
                            response.headers?.['etag'] ||
                            response.headers?.['ETag'];
                        if (!rawETag) {
                            throw new Error('MISSING_ETAG');
                        }

                        const cleanETag = String(rawETag)
                            .replace(/^"|"$/g, '')
                            .trim();

                        completedMap.set(partNumber, {
                            partNumber,
                            eTag: cleanETag,
                        });
                        partBytesLoaded.set(partNumber, end - start);
                        emitProgress();

                        success = true;
                        break;
                    } catch (error: any) {
                        lastError = error;
                        if (signal?.aborted || error?.name === 'AbortError') {
                            throw new DOMException('Upload aborted', 'AbortError');
                        }

                        if (error?.message === 'MISSING_ETAG') {
                            throw error;
                        }

                        // Nếu URL bị lỗi/hết hạn, re-fetch presigned URL ở lượt retry tiếp theo
                        currentUrl = undefined;

                        if (attempt < MAX_PART_RETRIES) {
                            const delay =
                                RETRY_DELAYS[attempt] ||
                                RETRY_DELAYS[RETRY_DELAYS.length - 1];
                            await sleep(delay, signal);
                        }
                    }
                }

                if (!success) {
                    throw (
                        lastError ||
                        new Error(
                            `Failed to upload part ${partNumber} after retries`
                        )
                    );
                }
            }
        };

        const activeWorkers = Array.from(
            { length: Math.min(concurrency, batchPartNumbers.length) },
            () => uploadBatchWorker()
        );

        await Promise.all(activeWorkers);
    }

    // Final progress update
    emitProgress();

    // Verify all parts completed
    if (completedMap.size !== partCount) {
        throw new Error(
            `Incomplete upload: completed ${completedMap.size} of ${partCount} parts`
        );
    }

    const sortedParts: Array<{ partNumber: number; eTag: string }> = [];
    completedMap.forEach((part) => {
        sortedParts.push(part);
    });
    sortedParts.sort((a, b) => a.partNumber - b.partNumber);

    return sortedParts;
}
