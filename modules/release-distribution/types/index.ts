import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';

export interface ReleaseCiExportRawDataLink {
    href: string;
}

export interface ReleaseCiExportRawDataLinks {
    self: ReleaseCiExportRawDataLink;
    export: ReleaseCiExportRawDataLink;
}

export interface ReleaseCiExportOrganisation {
    type: string;
    name: string;
    DPID: string;
    merlin_member_id: string | null;
    id: number;
    modify_time: string;
    organisation_id: string;
}

export interface ReleaseCiExportExportRequest {
    type: string;
    name: string;
    asset_type: string;
    completion_date: string | null;
    identifier: string;
    notes: string | null;
    number_of_tracks: number;
    status: string;
    export_external_id: string;
    number_of_services: number;
    task: string;
    total_tracks: number;
    organisation: ReleaseCiExportOrganisation;
    id: number;
    modify_time: string;
    export_id: string;
}

export interface ReleaseCiExportReleaseFormat {
    type: string;
    additional_identifier: string;
    barcode: string;
    catalog_no: string;
    explicit_content: string;
    gtin: string;
    identifier: string;
    meta_modify_time: string;
    released: string;
    status: string;
    title: string;
    weight: number | null;
    version_description: string;
    grid: string;
    track_count: number;
    format_type: string;
    qa_flags_run: string;
    volume_part: number;
    volume_total_parts: number;
    c_copy: string;
    p_copy: string;
    price_band: string;
    GTIN: string;
    sound_carrier_id: string;
    id: number;
    modify_time: string;
    release_format_id: string;
    display_artist: string;
    asset_controller_id: string;
    asset_owner_id: string;
    release_start_date: string;
}

export interface ReleaseCiExportExportBatch {
    type: string;
    exported_products_count: number;
    exported_tracks_count: number;
    identifier: string;
    external_batch_id: string;
    batch_transfer_status: string;
    transfer_end_time: string;
    id: number;
    modify_time: string;
    internal_batch_id: string;
}

export interface ReleaseCiExportMusicService {
    type: string;
    name: string;
    dpc: string;
    development_status: string;
    id: number;
    modify_time: string;
    DPID: string;
}

export interface ReleaseCiExportEmbeddedItem {
    type: string;
    status: string;
    exportRequest: ReleaseCiExportExportRequest;
    releaseFormat: ReleaseCiExportReleaseFormat;
    exportBatch: ReleaseCiExportExportBatch;
    musicService: ReleaseCiExportMusicService;
    deliver_desire_id: string;
    status_cause: string;
    id: number;
    create_time: string;
    modify_time: string;
    _links: ReleaseCiExportRawDataLinks;
}

export interface ReleaseCiExportRawData {
    _embedded: ReleaseCiExportEmbeddedItem[];
}

export interface ReleaseCiData {
    id: string;
    createdAt: string;
    updatedAt: string;
    releaseId: string;
    latestSyncedAt: string;
    status: string;
    release: ReleasesData;
    exportRawData: ReleaseCiExportRawData;
}

export type ReleaseCiDataFilter = ReleasesDataFilter;

