'use client';

import {
    CloudUploadOutlined,
    FolderAddOutlined,
    InboxOutlined,
    ReloadOutlined,
} from '@ant-design/icons';
import { Badge, Button, Card, Empty, Flex, Space, Typography } from 'antd';
import dayjs from 'dayjs';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
} from 'react';
import { fakeCreateReleaseDraft } from '../apis/fake-api';
import type { DraftRelease, DraftTrack, JobStatus } from '../types';
import ReleaseCard from './release-card';

const { Title, Text } = Typography;

// ── Constants ───────────────────────────────────────────────────────

const ARTWORK_EXTS = ['jpg', 'jpeg', 'png', 'webp'];
const TRACK_EXTS = ['wav', 'flac', 'mp3'];

function getExtension(name: string): string {
    return name.split('.').pop()?.toLowerCase() ?? '';
}

function isArtwork(file: File): boolean {
    const name = file.name.toLowerCase();
    return ARTWORK_EXTS.includes(getExtension(name)) && name.includes('cover');
}

function isTrack(file: File): boolean {
    return TRACK_EXTS.includes(getExtension(file.name));
}

function randomDuration(): number {
    return Math.round(120 + Math.random() * 140);
}

function uid(): string {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

function delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function groupFilesByFolder(files: File[]): Map<string, File[]> {
    const map = new Map<string, File[]>();
    for (const f of files) {
        const relPath = (f as any).webkitRelativePath || f.name;
        const folderName = relPath.split('/')[0] || 'Untitled';
        if (!map.has(folderName)) map.set(folderName, []);
        map.get(folderName)!.push(f);
    }
    return map;
}

function buildRelease(
    folderName: string,
    files: File[],
    blobUrls: string[]
): DraftRelease {
    let coverFile: File | null = null;
    const trackFiles: File[] = [];

    for (const f of files) {
        if (!coverFile && isArtwork(f)) coverFile = f;
        else if (isTrack(f)) trackFiles.push(f);
    }

    let coverUrl: string | null = null;
    if (coverFile) {
        coverUrl = URL.createObjectURL(coverFile);
        blobUrls.push(coverUrl);
    }

    const tracks: DraftTrack[] = trackFiles.map((f) => ({
        id: uid(),
        filename: f.name,
        durationSec: randomDuration(),
        sizeMB: parseFloat((f.size / (1024 * 1024)).toFixed(2)),
        status: 'pending' as JobStatus,
        file: f,
    }));

    return {
        id: uid(),
        title: folderName,
        artist: 'Demo Artist',
        label: 'AG Music',
        releaseDate: dayjs().format('YYYY-MM-DD'),
        totalTracks: tracks.length,
        coverFile,
        coverUrl,
        tracks,
        jobStatus: 'pending',
    };
}

function readEntry(entry: FileSystemEntry): Promise<File[]> {
    return new Promise((resolve) => {
        if (entry.isFile) {
            (entry as FileSystemFileEntry).file((f) => {
                Object.defineProperty(f, 'webkitRelativePath', {
                    value: entry.fullPath.replace(/^\//, ''),
                    writable: false,
                });
                resolve([f]);
            });
        } else if (entry.isDirectory) {
            const reader = (entry as FileSystemDirectoryEntry).createReader();
            reader.readEntries((entries) => {
                Promise.all(entries.map(readEntry)).then((r) =>
                    resolve(r.flat())
                );
            });
        } else {
            resolve([]);
        }
    });
}

const BulkUploadDemo: React.FC = () => {
    const [releases, setReleases] = useState<DraftRelease[]>([]);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const blobUrlsRef = useRef<string[]>([]);

    const revokeBlobUrls = useCallback(() => {
        blobUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
        blobUrlsRef.current = [];
    }, []);

    useEffect(() => () => revokeBlobUrls(), [revokeBlobUrls]);

    // ── State updaters ──────────────────────────────────────────────
    const updateRelease = useCallback(
        (id: string, patch: Partial<DraftRelease>) =>
            setReleases((prev) =>
                prev.map((r) => (r.id === id ? { ...r, ...patch } : r))
            ),
        []
    );

    const updateReleaseTracks = useCallback(
        (id: string, status: JobStatus) =>
            setReleases((prev) =>
                prev.map((r) =>
                    r.id === id
                        ? {
                              ...r,
                              tracks: r.tracks.map((t) => ({
                                  ...t,
                                  status,
                              })),
                          }
                        : r
                )
            ),
        []
    );

    // ── Pipeline ────────────────────────────────────────────────────
    const processOneRelease = useCallback(
        async (release: DraftRelease) => {
            await delay(randomBetween(300, 600));
            updateRelease(release.id, { jobStatus: 'uploading' });
            updateReleaseTracks(release.id, 'uploading');

            await delay(randomBetween(600, 1000));
            updateRelease(release.id, { jobStatus: 'processing' });
            updateReleaseTracks(release.id, 'processing');

            const response = await fakeCreateReleaseDraft(release);

            setReleases((prev) =>
                prev.map((r) =>
                    r.id === release.id
                        ? {
                              ...r,
                              jobStatus: 'done' as JobStatus,
                              tracks: r.tracks.map((t, i) => ({
                                  ...t,
                                  status: 'done' as JobStatus,
                                  storageKey: response.tracks[i]?.storageKey,
                              })),
                          }
                        : r
                )
            );
        },
        [updateRelease, updateReleaseTracks]
    );

    const processAllReleases = useCallback(
        async (drafts: DraftRelease[]) => {
            setIsProcessing(true);
            for (const draft of drafts) {
                await processOneRelease(draft);
            }
            setIsProcessing(false);
        },
        [processOneRelease]
    );

    // ── File handlers ───────────────────────────────────────────────
    const processFiles = useCallback(
        (files: File[]) => {
            const folderMap = groupFilesByFolder(files);
            const newReleases: DraftRelease[] = [];
            folderMap.forEach((folderFiles, folderName) => {
                const rel = buildRelease(
                    folderName,
                    folderFiles,
                    blobUrlsRef.current
                );
                if (rel.totalTracks > 0) newReleases.push(rel);
            });
            if (newReleases.length === 0) return;
            setReleases((prev) => [...prev, ...newReleases]);
            processAllReleases(newReleases);
        },
        [processAllReleases]
    );

    const handleInputChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const fileList = e.target.files;
            if (!fileList || fileList.length === 0) return;
            processFiles(Array.from(fileList));
            if (inputRef.current) inputRef.current.value = '';
        },
        [processFiles]
    );

    const handleDrop = useCallback(
        (e: React.DragEvent<HTMLDivElement>) => {
            e.preventDefault();
            e.stopPropagation();
            const items = e.dataTransfer.items;
            if (!items) return;
            const filePromises: Promise<File[]>[] = [];
            for (let i = 0; i < items.length; i++) {
                const item = items[i].webkitGetAsEntry?.();
                if (item) filePromises.push(readEntry(item));
            }
            Promise.all(filePromises).then((results) => {
                const allFiles = results.flat();
                if (allFiles.length > 0) processFiles(allFiles);
            });
        },
        [processFiles]
    );

    const handleReset = useCallback(() => {
        revokeBlobUrls();
        setReleases([]);
        setIsProcessing(false);
        if (inputRef.current) inputRef.current.value = '';
    }, [revokeBlobUrls]);

    const handleRemoveRelease = useCallback((releaseId: string) => {
        setReleases((prev) => prev.filter((r) => r.id !== releaseId));
    }, []);

    // ── Stats ───────────────────────────────────────────────────────
    const stats = useMemo(() => {
        const total = releases.length;
        const done = releases.filter((r) => r.jobStatus === 'done').length;
        const totalTracks = releases.reduce((acc, r) => acc + r.totalTracks, 0);
        return { total, done, totalTracks };
    }, [releases]);

    // ── Hidden native input for webkitdirectory ─────────────────────
    const hiddenInput = (
        <input
            ref={inputRef}
            type="file"
            /* @ts-ignore -- webkitdirectory is non-standard */
            webkitdirectory=""
            directory=""
            multiple
            style={{ display: 'none' }}
            onChange={handleInputChange}
        />
    );

    return (
        <div style={{ maxWidth: 1000, margin: '0 auto', padding: '24px 16px' }}>
            {/* Page header */}
            <Flex
                align="center"
                justify="space-between"
                style={{ marginBottom: 20 }}
            >
                <Typography.Title level={3} style={{ margin: 0 }}>
                    <CloudUploadOutlined style={{ marginRight: 8 }} />
                    Bulk Upload Demo
                </Typography.Title>
                {releases.length > 0 && (
                    <Space size="middle">
                        <Badge
                            count={`${stats.done}/${stats.total}`}
                            showZero
                            color={
                                stats.done === stats.total ? 'green' : 'blue'
                            }
                        />
                        <Text type="secondary">{stats.totalTracks} tracks</Text>
                    </Space>
                )}
            </Flex>

            {/* Drop zone */}
            <Card
                style={{ marginBottom: 24, cursor: 'pointer' }}
                styles={{ body: { padding: releases.length > 0 ? 16 : 32 } }}
                onClick={() => inputRef.current?.click()}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
            >
                <Flex
                    vertical
                    align="center"
                    justify="center"
                    gap={releases.length > 0 ? 8 : 16}
                >
                    <InboxOutlined
                        style={{
                            fontSize: releases.length > 0 ? 32 : 52,
                            color: '#1677ff',
                        }}
                    />
                    <Text strong>
                        {releases.length > 0
                            ? 'Thêm folder khác'
                            : 'Chọn folder hoặc kéo thả vào đây'}
                    </Text>
                    {releases.length === 0 && (
                        <Text type="secondary">
                            Mỗi folder = 1 release. Folder chứa cover.* + *.wav
                        </Text>
                    )}
                    <Button
                        type="primary"
                        icon={<FolderAddOutlined />}
                        size={releases.length > 0 ? 'middle' : 'large'}
                    >
                        {releases.length > 0 ? 'Thêm Folder' : 'Chọn Folder'}
                    </Button>
                </Flex>
            </Card>

            {hiddenInput}

            {/* Release cards */}
            {releases.length > 0 && (
                <Space
                    direction="vertical"
                    size="middle"
                    style={{ width: '100%' }}
                >
                    {releases.map((release) => (
                        <ReleaseCard
                            key={release.id}
                            release={release}
                            onRemove={handleRemoveRelease}
                        />
                    ))}

                    <Flex justify="center" style={{ marginTop: 8 }}>
                        <Button
                            icon={<ReloadOutlined />}
                            onClick={handleReset}
                            size="large"
                            danger
                        >
                            Reset tất cả
                        </Button>
                    </Flex>
                </Space>
            )}

            {releases.length === 0 && (
                <Empty
                    description="Chưa có release nào. Hãy chọn folder để bắt đầu!"
                    style={{ marginTop: 40 }}
                />
            )}
        </div>
    );
};

export default BulkUploadDemo;
