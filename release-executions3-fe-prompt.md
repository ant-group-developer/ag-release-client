# Prompt FE: update `/release-submits` to use `release-executions3`

Bạn là FE engineer đang làm trong project Next.js/React/TypeScript/Ant Design hiện có. Hãy cập nhật page `http://localhost:6200/en/release-submits` và các component/hook/API liên quan để dùng BE contract mới cho `release-executions3`.

## Mục tiêu

Page `/release-submits` hiện đang gọi API cũ liên quan `@Controller('release-submits')`. BE đã đổi sang:

```ts
@Controller('release-executions3')
```

Hãy đổi toàn bộ API trong luồng page này sang endpoint mới:

```ts
GET /release-executions3
GET /release-executions3/:id
POST /release-executions3/steps/:stepId/retry
```

Nếu có tab/component khác đang reuse list submit, ví dụ `modules/release-video/components/modal/submits-tab.tsx`, cũng cập nhật cùng contract mới.

## Top-Level Query DTO BE

BE nhận query list execution dạng:

```ts
export class QueryGetListReleaseExecution3Dto extends BaseQueryDto2 {
    @IsOptional()
    @IsEnum(FieldOrderReleaseExecution3)
    fieldOrder: FieldOrderReleaseExecution3 =
        FieldOrderReleaseExecution3.execution_createdAt;

    @IsOptional()
    @IsUUID()
    releaseId?: string;

    @IsOptional()
    @IsEnum(ReleaseExecutionStepStatus)
    status?: ReleaseExecutionStepStatus;

    @IsOptional()
    @Transform(({ value }) => {
        if (value === true || value === 'true') return true;
        if (value === false || value === 'false') return false;
        return value;
    })
    @IsBoolean()
    latestOnly?: boolean;

    @IsOptional()
    @ValidateNested()
    @Type(() => QueryGetListReleaseDto)
    queryListReleases?: QueryGetListReleaseDto;

    @IsOptional()
    @ValidateNested({ each: true })
    @Type(() => QueryReleaseExecutionStepFilterDto)
    steps?: QueryReleaseExecutionStepFilterDto[];
}
```

Important:

- `status` top-level là execution/step status filter theo BE mới, không phải release status.
- `queryListReleases` là object con chứa toàn bộ filter liên quan release.
- `steps` là mảng object top-level, không nằm trong `queryListReleases`.
- `latestOnly` mặc định FE phải truyền `true`, nhưng người dùng có thể bỏ chọn để không truyền param này.

## Status Filter

Sửa status execution filter thành enum mới:

```ts
export enum ReleaseExecutionStatus {
    NEW = 'NEW',
    PROCESSING = 'PROCESSING',
    WAITING_ACTION = 'WAITING_ACTION',
    WAITING_PARTNER = 'WAITING_PARTNER',
    DONE = 'DONE',
    FAILED = 'FAILED',
    CANCELLED = 'CANCELLED',
}
```

UI filter status bên ngoài là filter execution, gửi top-level:

```ts
status=FAILED
```

Không dùng các status cũ như `QUEUED`, `RUNNING`, `AWAITING_ACTION`, `COMPLETED`, `PARTIALLY_COMPLETED`.

## Sort Field

BE nhận order field:

```ts
export enum FieldOrderReleaseExecution3 {
    execution_createdAt = 'execution.createdAt',
    execution_type = 'execution.type',
    execution_releaseTitle = 'execution.releaseTitle',
    execution_releaseUpc = 'execution.releaseUpc',
    execution_status = 'execution.status',
}
```

Default filter của page:

```ts
{
    page: 1,
    pageSize: PAGE_SIZE,
    orderBy: ORDER.DESC,
    fieldOrder: FieldOrderReleaseExecution3.execution_createdAt,
    latestOnly: true,
}
```

Các cột sortable cần gửi đúng `fieldOrder`:

- Created At -> `execution.createdAt`
- Type -> `execution.type`
- Release Title -> `execution.releaseTitle`
- Release UPC -> `execution.releaseUpc`
- Status -> `execution.status`

## Release Filter

BE đổi tên field object release filter thành:

```ts
queryListReleases
```

Không gửi `release`. Không gửi các filter release dưới dạng top-level phẳng.

Đúng:

```ts
{
    queryListReleases: {
        keyword: 'abc',
        labelId: ['id1', 'id2'],
        status: ['DRAFT', 'SUBMITTED'],
    },
}
```

Sai:

```ts
{
    release: { keyword: 'abc' },
    keyword: 'abc',
    labelId: 'id1,id2',
}
```

Hãy bê nguyên filter của page release sang, nhưng truyền vào trong object `queryListReleases`.

Các field release filter thường có:

```ts
queryListReleases?: {
    keyword?: string;
    type?: string | string[];
    status?: string | string[];
    startCreatedAt?: string;
    endCreatedAt?: string;
    startUpdatedAt?: string;
    endUpdatedAt?: string;
    startDateCreated?: string;
    endDateCreated?: string;
    startDateRelease?: string;
    endDateRelease?: string;
    genres?: string | string[];
    artistId?: string | string[];
    labelId?: string | string[];
    albumFormatId?: string | string[];
    releaseId?: string;
    isVariousArtist?: string | string[];
    idInclude?: string | string[];
    isImportedFromReport?: string | string[];
    tenantIds?: string | string[];
}
```

Các checkbox multi của release filter phải giữ dạng mảng, không join comma string. Ví dụ:

```ts
queryListReleases: {
    labelId: ['label-1', 'label-2'],
    genres: ['genre-1', 'genre-2'],
    albumFormatId: ['format-1'],
    status: ['DRAFT', 'READY'],
}
```

## Latest Only UI

Thêm một checkbox ở khu filter execution bên ngoài:

- Label: `Latest only`
- Default checked: true
- Nếu checked: gửi `latestOnly=true`
- Nếu unchecked: không truyền `latestOnly`

Implementation hint:

- Vì `useFilter` có default merge, có thể dùng sentinel internal như `'all'` để thể hiện “không truyền”.
- Khi map params gọi API: nếu `latestOnly === 'all'` thì omit field.

## Steps Filter

Thêm filter `steps` top-level, hiển thị UI dạng bảng.

BE nhận:

```ts
steps: [
    {
        type: 'PROCESS_AGG_CI',
        status: 'DONE',
    },
    {
        type: 'SYNC_DATA_DSP_CI',
        status: 'FAILED',
        exclude: true,
    },
]
```

Ý nghĩa:

- `{ type, status }`: tìm execution có step khớp `type/status`.
- `{ type, status, exclude: true }`: loại execution có step khớp `type/status`.

Query string phải serialize đúng dạng index:

```txt
steps[0][type]=PROCESS_AGG_CI
steps[0][status]=DONE
steps[1][type]=SYNC_DATA_DSP_CI
steps[1][status]=FAILED
steps[1][exclude]=true
```

UI yêu cầu:

- Nút `Steps` trong header filter execution.
- Click mở popover/modal nhỏ chứa bảng.
- Mỗi row có:
  - Select `type`
  - Select `status`
  - Checkbox `exclude`
  - Button xoá row
- Có button `Add step`.
- Nút Steps hiển thị count nếu có filter, ví dụ `Steps (2)`.

Step type enum:

```ts
export enum ReleaseExecutionStepType {
    GEN_UPC = 'GEN_UPC',
    GEN_ISRCS = 'GEN_ISRCS',
    GEN_ISRC = 'GEN_ISRC',
    VALIDATE = 'VALIDATE',
    PROCESS_DSPS = 'PROCESS_DSPS',

    PROCESS_DIRECT = 'PROCESS_DIRECT',
    PROCESS_DIRECT_CHILD = 'PROCESS_DIRECT_CHILD',
    SYNC_DATA_PARTNER = 'SYNC_DATA_PARTNER',

    PROCESS_AGG = 'PROCESS_AGG',
    PROCESS_AGG_CI = 'PROCESS_AGG_CI',
    IMPORT_CI = 'IMPORT_CI',
    EXPORT_CI = 'EXPORT_CI',
    CREATE_FOLDER_DONE_CI = 'CREATE_FOLDER_DONE_CI',
    VALIDATE_QA_CI = 'VALIDATE_QA_CI',

    EXPORT_AGG_CI_CI = 'EXPORT_CI_CI',
    EXPORT_AGG_CI_STATE51 = 'EXPORT_AGG_CI_STATE51',
    WAITING_ADMIN_EXPORT = 'WAITING_ADMIN_EXPORT',
    SEND_EMAIL_STATE51 = 'SEND_EMAIL_STATE51',
    SYNC_DATA_DSP_CI = 'SYNC_DATA_DSP_CI',

    WAIT_PARTNER_PROCESS = 'WAIT_PARTNER_PROCESS',
    CREATE_METADATA_ON_SERVER = 'CREATE_METADATA_ON_SERVER',
    UPLOAD_METADATA_TO_SFTP = 'UPLOAD_METADATA_TO_SFTP',
    SYNC_RESULT_TO_RELEASE = 'SYNC_RESULT_TO_RELEASE',
}
```

Step status options can use the execution step status values currently supported by FE/BE:

```ts
PENDING
RUNNING
SUCCESS
FAILED
CANCELLED
NEW
DONE
PROCESSING
WAITING_ACTION
```

## Query Serialization

Axios default serializer may serialize nested object incorrectly. Implement custom serializer for this API.

Rules:

1. Omit `undefined`, `null`, empty string, and empty arrays.
2. Nested object uses bracket syntax:

```txt
queryListReleases[keyword]=abc
```

3. Array of scalar uses `[]`:

```txt
queryListReleases[labelId][]=label-1
queryListReleases[labelId][]=label-2
```

4. Array of object uses numeric index:

```txt
steps[0][type]=PROCESS_AGG_CI
steps[0][status]=DONE
steps[1][type]=SYNC_DATA_DSP_CI
steps[1][status]=FAILED
steps[1][exclude]=true
```

Example serializer:

```ts
const serializeParams = (params: Record<string, unknown>) => {
    const searchParams = new URLSearchParams();

    const appendParam = (key: string, value: unknown) => {
        if (value === undefined || value === null || value === '') return;

        if (Array.isArray(value)) {
            value.forEach((item, index) => {
                const arrayKey =
                    item && typeof item === 'object'
                        ? `${key}[${index}]`
                        : `${key}[]`;
                appendParam(arrayKey, item);
            });
            return;
        }

        if (value && typeof value === 'object') {
            Object.entries(value as Record<string, unknown>).forEach(
                ([childKey, childValue]) => {
                    appendParam(`${key}[${childKey}]`, childValue);
                }
            );
            return;
        }

        searchParams.append(key, String(value));
    };

    Object.entries(params).forEach(([key, value]) => {
        appendParam(key, value);
    });

    return searchParams.toString();
};
```

## Params Mapping Before API Call

Before calling API, normalize params:

```ts
const compactObject = <T extends Record<string, unknown>>(value: T) =>
    Object.entries(value).reduce((result, [key, item]) => {
        if (
            item !== undefined &&
            item !== null &&
            item !== '' &&
            (!Array.isArray(item) || item.length > 0)
        ) {
            result[key as keyof T] = item as T[keyof T];
        }
        return result;
    }, {} as Partial<T>);

const mapReleaseExecution3Params = (params: ReleaseSubmitFilter) => {
    const { queryListReleases, type, latestOnly, ...executionParams } = params;

    const queryListReleasesParams = compactObject({
        ...queryListReleases,
        isImportedFromReport:
            queryListReleases?.isImportedFromReport === 'all'
                ? undefined
                : queryListReleases?.isImportedFromReport,
    });

    return compactObject({
        ...executionParams,
        latestOnly: latestOnly === 'all' ? undefined : latestOnly,
        queryListReleases:
            Object.keys(queryListReleasesParams).length > 0
                ? queryListReleasesParams
                : undefined,
    });
};
```

Note:

- `type` top-level cũ không còn trong DTO BE mới, do đó không nên gửi.
- `queryListReleases` chỉ gửi khi có ít nhất một field con.
- `isImportedFromReport === 'all'` là sentinel FE, không gửi lên BE.

## URL State

Nếu app đang dùng `useFilter` lưu filter lên URL:

- Object filter như `queryListReleases` và array object như `steps` cần lưu/đọc được.
- Có thể stringify object/array khi push URL và JSON.parse khi đọc query params.
- Tránh để URL thành `queryListReleases=[object Object]`.

## Prompt bổ sung: sửa UI Steps filter thành bảng theo từng step

Trong page `/release-submits`, phần filter `Steps` hiện tại đang là popover cho phép add từng row gồm `type`, `status`, `exclude`. Hãy sửa lại thành UI bảng cố định list tất cả step type.

### Yêu cầu UI

Nút `Steps` trong header vẫn giữ dạng popover. Khi mở popover, hiển thị một bảng với các cột:

1. `Apply`: checkbox đánh dấu có áp dụng filter cho step này hay không.
2. `Step`: hiển thị tất cả step type trong enum `ReleaseExecutionStepType`.
3. `Include`: multi select status.
4. `Exclude`: multi select status.

Mỗi dòng tương ứng với một step type. Không còn nút `Add step`, không còn cột delete, không còn select type trong từng row.

Nếu `Apply` không được chọn:

- Disable hai select `Include` và `Exclude`.
- Làm row xám đi để user biết filter này chưa được áp dụng.
- Khi parse filter gửi API, bỏ qua row đó hoàn toàn.

Nếu `Apply` được chọn:

- Cho phép chọn nhiều status ở `Include`.
- Cho phép chọn nhiều status ở `Exclude`.
- Nút `Steps` hiển thị số lượng step type đang được apply, ví dụ `Steps (3)`.

### Step type

Dùng đầy đủ enum:

```ts
export enum ReleaseExecutionStepType {
    GEN_UPC = 'GEN_UPC',
    GEN_ISRCS = 'GEN_ISRCS',
    GEN_ISRC = 'GEN_ISRC',
    VALIDATE = 'VALIDATE',
    PROCESS_DSPS = 'PROCESS_DSPS',

    PROCESS_DIRECT = 'PROCESS_DIRECT',
    PROCESS_DIRECT_CHILD = 'PROCESS_DIRECT_CHILD',
    SYNC_DATA_PARTNER = 'SYNC_DATA_PARTNER',

    PROCESS_AGG = 'PROCESS_AGG',
    PROCESS_AGG_CI = 'PROCESS_AGG_CI',
    IMPORT_CI = 'IMPORT_CI',
    EXPORT_CI = 'EXPORT_CI',
    CREATE_FOLDER_DONE_CI = 'CREATE_FOLDER_DONE_CI',
    VALIDATE_QA_CI = 'VALIDATE_QA_CI',

    EXPORT_AGG_CI_CI = 'EXPORT_CI_CI',
    EXPORT_AGG_CI_STATE51 = 'EXPORT_AGG_CI_STATE51',
    WAITING_ADMIN_EXPORT = 'WAITING_ADMIN_EXPORT',
    SEND_EMAIL_STATE51 = 'SEND_EMAIL_STATE51',
    SYNC_DATA_DSP_CI = 'SYNC_DATA_DSP_CI',

    WAIT_PARTNER_PROCESS = 'WAIT_PARTNER_PROCESS',
    CREATE_METADATA_ON_SERVER = 'CREATE_METADATA_ON_SERVER',
    UPLOAD_METADATA_TO_SFTP = 'UPLOAD_METADATA_TO_SFTP',
    SYNC_RESULT_TO_RELEASE = 'SYNC_RESULT_TO_RELEASE',
}
```

### Status options

`Include` và `Exclude` dùng chung status options:

```ts
PENDING
RUNNING
SUCCESS
FAILED
CANCELLED
NEW
DONE
PROCESSING
WAITING_ACTION
```

### Parse UI table ra DTO gửi BE

BE nhận mảng:

```ts
export class QueryReleaseExecutionStepDto {
    type?: ReleaseExecutionStepType;
    status?: ReleaseExecutionStepStatus;
    exclude?: boolean;
}
```

Vì DTO chỉ nhận một `status` trên mỗi item, FE phải expand multi select thành nhiều object.

Ví dụ UI:

- Row `PROCESS_AGG_CI`
- Apply = checked
- Include = `[DONE, FAILED]`
- Exclude = `[CANCELLED]`

Parse thành:

```ts
steps: [
    { type: 'PROCESS_AGG_CI', status: 'DONE' },
    { type: 'PROCESS_AGG_CI', status: 'FAILED' },
    { type: 'PROCESS_AGG_CI', status: 'CANCELLED', exclude: true },
]
```

Nếu row apply nhưng cả Include và Exclude đều rỗng, có thể gửi:

```ts
{ type: 'PROCESS_AGG_CI' }
```

Nếu row không apply thì không gửi gì cho row đó.

### Query string cần serialize đúng

Kết quả gửi API phải là top-level `steps`, không nằm trong `queryListReleases`.

Ví dụ:

```txt
steps[0][type]=PROCESS_AGG_CI
steps[0][status]=DONE
steps[1][type]=PROCESS_AGG_CI
steps[1][status]=FAILED
steps[2][type]=PROCESS_AGG_CI
steps[2][status]=CANCELLED
steps[2][exclude]=true
```

Không gửi:

```txt
queryListReleases[steps]=...
steps=[object Object]
```

### URL state

Nếu filter đang được lưu lên URL:

- Khi set query param, stringify `steps` bằng JSON.
- Khi đọc URL, nếu value bắt đầu bằng `[` thì JSON.parse lại.
- Sau khi refresh page, bảng phải restore đúng:
  - Step nào đang apply.
  - Status nào đang nằm trong Include.
  - Status nào đang nằm trong Exclude.

### Acceptance criteria

- [ ] Popover `Steps` hiển thị bảng cố định tất cả step type.
- [ ] Cột đầu là checkbox `Apply`.
- [ ] Row không apply bị disable include/exclude và hiển thị xám.
- [ ] Include là multi select status.
- [ ] Exclude là multi select status.
- [ ] Không còn flow add/delete từng step row.
- [ ] Multi status được expand thành nhiều object DTO.
- [ ] `exclude: true` chỉ xuất hiện cho status chọn ở cột Exclude.
- [ ] `steps` được gửi top-level bằng bracket syntax indexed object array.
- [ ] Count trên nút `Steps (n)` tính theo số step type đang apply, không tính tổng số status.

## Checklist

- [ ] `/release-submits` gọi `GET /release-executions3`.
- [ ] Detail modal gọi `GET /release-executions3/:id`.
- [ ] Retry step gọi `POST /release-executions3/steps/:stepId/retry`.
- [ ] Default `fieldOrder=execution.createdAt`.
- [ ] Default `latestOnly=true`.
- [ ] Checkbox `Latest only` có thể bỏ chọn để omit param.
- [ ] Execution status filter dùng enum mới.
- [ ] Release filters nằm trong `queryListReleases`, không nằm top-level.
- [ ] Release multi filters giữ dạng array.
- [ ] `steps` filter là bảng, gửi top-level array object.
- [ ] Query serializer tạo đúng bracket syntax cho nested object và indexed object arrays.
- [ ] Các sortable column gửi đúng `execution.*`.
- [ ] Các component reuse list submit như video submits tab cũng dùng default/filter/API mới.
