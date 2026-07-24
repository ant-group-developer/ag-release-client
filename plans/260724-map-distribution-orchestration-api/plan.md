# Map API `distribution-orchestration` vào Client

> Work context: `E:/CODE/ag-release/ag-release-client`
> Server: module `distribution-orchestration`, prefix `/distributions` (client gọi qua rewrite `/api/v1/*`).
> Scope đã chốt: **module mới** `modules/distribution-orchestration` + **API layer + hooks + UI components**.

## Server endpoints (nguồn sự thật)

Write — `distribution-command.controller.ts`:
| Method | Path | Body | Response | RBAC |
|---|---|---|---|---|
| POST | `/distributions` | `releaseId`, `type`, `channelSpecs[]`, `idempotencyKey?` | `{ distributionId }` | JWT |
| POST | `/distributions/:id/review/approve` | `idempotencyKey?` | `{ ok: true }` | `release_review.approve` |
| POST | `/distributions/:id/review/reject` | `note?`, `idempotencyKey?` | `{ ok: true }` | `release_review.reject` |
| POST | `/distributions/:id/retry` | `channelIds?`, `idempotencyKey?` | `{ ok: true }` | release update |

Read — `distribution.controller.ts`:
| Method | Path | Query | Response |
|---|---|---|---|
| GET | `/distributions/:id/timeline` | `cursor?`, `limit?` (≤200) | `ResponseSuccess<{ items: TimelineEvent[], nextCursor: string\|null }>` |
| GET (SSE) | `/distributions/:id/stream` | — | `text/event-stream` (MessageEvent) |
| GET | `/distributions/metrics` | — | `ResponseSuccess<{ projection, sse }>` (admin) |

Enum cần mirror: `ExecutionType` (INITIAL_RELEASE/UPDATE/TAKEDOWN/RETRY), `DistributionState` (11 giá trị), `ChannelState` (7), `ChannelTopology` (DIRECT/VIA_AGGREGATOR), `ExportMethod` (CI_DEAL/STATE51).
`ChannelDeliverySpec`: `dspCode`, `topology`, `processCode`, `aggregatorCode?`, `exportMethod?`, `hasDeal?`.
`TimelineEvent`: `id`, `type`, `channelId|null`, `level` ('milestone'|'progress'), `payload`, `occurredAt`.

⚠ Không có `GET /distributions` (list) → UI không có trang danh sách; trọng tâm là **timeline theo id**.

## Convention client (đã xác nhận)

- axios: `@/api/axios-auth` (baseURL `/api/v1`, tự gắn JWT + refresh).
- react-query hooks: `useQuery`/`useMutation` + `useApiNotify` (handleSuccess/handleError) + `invalidateQueries`.
- SSE: `@microsoft/fetch-event-source` (mẫu `modules/report-import/hooks/use-enrich-scan-events.ts`), URL tuyệt đối `/api/v1/...`.
- query-keys: object factory theo `QUERY_KEY.<MODULE>` trong `constants/query-key.ts`.
- Response types: `DetailResponse<T>` (đã có trong `@/types/api`).
- UI: antd + `@ant-design/pro-components`, `next-intl` (`useTranslations`), page dưới `app/[locale]/(cms)/...`.

## Cấu trúc tạo mới

```
modules/distribution-orchestration/
├── apis/index.ts                      # 7 endpoint (SSE tách riêng ở hook)
├── enums/index.ts                     # 5 enum mirror server
├── types/index.ts                     # ChannelDeliverySpec, TimelineEvent, payload/response types
├── constants/query-keys.ts            # factory keys
├── hooks/
│   ├── use-submit-distribution.ts     # useMutation POST /distributions
│   ├── use-approve-review.ts          # useMutation approve
│   ├── use-reject-review.ts           # useMutation reject
│   ├── use-retry-distribution.ts      # useMutation retry
│   ├── use-get-timeline.ts            # useInfiniteQuery cursor pagination
│   ├── use-distribution-stream.ts     # SSE live events (fetchEventSource)
│   └── use-get-metrics.ts             # useQuery metrics (admin)
└── components/
    ├── timeline/index.tsx             # render timeline events + live badge (merge query + SSE)
    ├── timeline-item/index.tsx        # 1 dòng event (icon theo level/type)
    └── review-actions/index.tsx       # nút Approve / Reject / Retry (theo state)
```

Sửa thêm:
- `constants/query-key.ts`: thêm block `DISTRIBUTION_ORCHESTRATION`.
- `messages/*`: thêm i18n keys (vi + en) cho label/nút/state.
- (nếu cần page demo) `app/[locale]/(cms)/distribution-orchestration/[id]/page.tsx` host timeline + actions.

## Bước triển khai

1. **Enums** — mirror 5 enum từ server (giữ nguyên string value để so khớp).
2. **Types** — `ChannelDeliverySpec`, `TimelineEvent`, `SubmitPayload`, `ReviewPayload`, `RetryPayload`, `TimelineResult`, `MetricsResult`, response wrappers.
3. **apis/index.ts** — 6 hàm axios (submit/approve/reject/retry/getTimeline/getMetrics). SSE không qua axios.
4. **query-keys** — factory + đăng ký `QUERY_KEY.DISTRIBUTION_ORCHESTRATION`.
5. **Mutation hooks** (4) — theo pattern `use-retry` (useApiNotify + invalidate timeline).
6. **use-get-timeline** — `useInfiniteQuery`, `getNextPageParam` = `nextCursor`.
7. **use-distribution-stream** — clone pattern enrich-scan, parse event → push vào state; option `enabled`, `onEvent`, terminal detect (DISTRIBUTED/FAILED/...).
8. **use-get-metrics** — `useQuery` (admin, `enabled` flag).
9. **UI components** — timeline (merge lịch sử + live), review-actions (hiện nút theo state truyền vào).
10. **(tùy)** page demo host component.
11. **i18n** — thêm keys.
12. **Verify** — `yarn tsc --noEmit` (hoặc build) đảm bảo không lỗi type.

## Quyết định / mặc định

- `channelSpecs` để type chặt theo `ChannelDeliverySpec` (không `unknown[]`) — client biết shape.
- `idempotencyKey` sinh phía client bằng `uuid` (đã có trong deps? sẽ kiểm; nếu không, dùng `crypto.randomUUID`).
- Timeline dùng `useInfiniteQuery` để hỗ trợ cursor; SSE chạy song song cập nhật realtime, merge dedupe theo `event.id`.
- Metrics là admin-only → hook có cờ `enabled`, không tự chạy nếu không phải admin.

## Rủi ro

- Response bọc `ResponseSuccess` (timeline/metrics) khác `{ok:true}`/`{distributionId}` (command trả trực tiếp, KHÔNG bọc) → type cho đúng từng endpoint.
- SSE cần JWT: mẫu enrich-scan comment phần header; server này có global JwtAuthGuard → cần xác minh cookie/nextauth có tự đính kèm không, nếu không phải gắn `Authorization` từ `getSession()` (như phần comment). Sẽ bật header trong hook stream để chắc.

## Câu hỏi tồn đọng

- SSE `/stream` xác thực bằng cookie hay Bearer? (sẽ thử Bearer từ getSession để an toàn — cần bạn xác nhận nếu server chỉ nhận cookie).
- Có cần page demo host UI, hay component sẽ được gắn vào trang release-detail sẵn có do bạn tự ráp sau?
