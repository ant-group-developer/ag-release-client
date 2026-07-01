import { ReleasesData, ReleasesDataFilter } from '@/modules/releases/types';

export interface ReleaseCiRawDataLink {
    href: string;
}

export interface ReleaseCiRawDataReleaseFormat {
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

export interface ReleaseCiExportRawDataLinks {
    self: ReleaseCiRawDataLink;
    export: ReleaseCiRawDataLink;
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

export interface ReleaseCiExportRequest {
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

export interface ReleaseCiExportBatch {
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
    exportRequest: ReleaseCiExportRequest;
    releaseFormat: ReleaseCiRawDataReleaseFormat;
    exportBatch: ReleaseCiExportBatch;
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

export interface ReleaseCiImportRawDataLinks {
    self: ReleaseCiRawDataLink;
    file: ReleaseCiRawDataLink;
    import: ReleaseCiRawDataLink;
}

export interface ReleaseCiImportEntity {
    type: string;
    name: string;
    asset_type: string;
    completion_date: string | null;
    identifier: string;
    notes: string | null;
    number_of_tracks: number;
    status: string;
    task: string;
    number_of_releases: number;
    priority: string;
    import_external_identifier: string;
    releaseFormats: ReleaseCiRawDataReleaseFormat[];
    id: number;
    create_time: string;
    modify_time: string;
    import_id: string;
}

export interface ReleaseCiImportFileLinks {
    self: ReleaseCiRawDataLink;
    download: ReleaseCiRawDataLink;
    files_api: ReleaseCiRawDataLink;
}

export interface ReleaseCiImportFileDescription {
    warnings: string[];
}

export interface ReleaseCiImportFile {
    sha512: string;
    status: string;
    caption: string;
    crc32: number;
    credit: string | null;
    digest: string;
    directory: string | null;
    encoded_by_us: boolean;
    extension: string;
    filesize: number;
    height: number | null;
    mime_major: string;
    mime_minor: string;
    stored_in_ceph: number;
    stored_in_mogile: boolean;
    subject_date: string | null;
    uploader_ip: string | null;
    width: number | null;
    storage_backend: string;
    track_count: number;
    import_status: string;
    status_cause: string;
    package_id: string;
    filesApi: ReleaseCiRawDataLink;
    _links: ReleaseCiImportFileLinks;
    type: string;
    file_id: string;
    asset_controller_id: string;
    creator_id: string | null;
    description: ReleaseCiImportFileDescription[];
    name: string;
    id: number;
    create_time: string;
    modify_time: string;
    import_file_id: string;
    GTIN: string;
}

export interface ReleaseCiImportEmbeddedItem {
    type: string;
    batch_size: number;
    external_identifier: string;
    status: string;
    status_cause: string;
    importEntity: ReleaseCiImportEntity;
    import_file: ReleaseCiImportFile[];
    id: number;
    create_time: string;
    modify_time: string;
    internal_batch_identifier: string;
    import_external_identifier: string;
    notes: string | null;
    _links: ReleaseCiImportRawDataLinks;
}

export interface ReleaseCiImportRawData {
    _embedded: ReleaseCiImportEmbeddedItem[];
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
    importRawData: ReleaseCiImportRawData;
}

export type ReleaseCiDataFilter = ReleasesDataFilter;
