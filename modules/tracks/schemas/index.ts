import { TrackArtistData } from '@/modules/track-artist/types';
import { z } from 'zod';

export const releaseTrackSchema = (messages: any) =>
    z.object({
        title: z
            .string()
            .min(1, messages('validation.input'))
            .max(100, messages('validation.input'))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        version: z
            .string()
            .max(50, messages('validation.max', { number: 50 }))
            .optional()
            .nullable(),
        isrc: z
            .union([
                z.literal(''),
                z
                    .string()
                    .min(12, messages('validation.min', { number: 12 }))
                    .max(12, messages('validation.max', { number: 12 })),
            ])
            .optional()
            .nullable(),
        iswc: z.string().optional().nullable(),
        pLineOwner: z
            .string()
            .max(200, messages('validation.max', { number: 200 }))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        pLineYear: z.union([z.number(), z.null()]).superRefine((val, ctx) => {
            if (val === null) {
                ctx.addIssue({
                    code: z.ZodIssueCode.custom,
                    message: messages('validation.input'),
                });
            }
        }),
        primaryGenreId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        subGenreId: z.string().optional().nullable(),
        trackOriginTypeId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        trackLanguage: z.object({
            metadataLanguageId: z
                .string()
                .nullable()
                .refine((val) => val !== null && val !== '', {
                    message: messages('validation.input'),
                }),

            audioLanguageId: z
                .string()
                .nullable()
                .refine((val) => val !== null && val !== '', {
                    message: messages('validation.input'),
                }),

            metadataLanguageCountryId: z
                .string()
                .nullable()
                .refine((val) => val !== null && val !== '', {
                    message: messages('validation.input'),
                }),

            recordingCountryId: z
                .string()
                .nullable()
                .refine((val) => val !== null && val !== '', {
                    message: messages('validation.input'),
                }),
        }),
        trackArtists: z
            .array(z.custom<TrackArtistData>())
            .min(1, messages('validation.input')),
        copyArtistsFromRelease: z.boolean().optional(),
        trackSensitiveId: z.string().optional(),
        isByAi: z.boolean().optional(),
        isInstrumental: z.boolean().optional(),
        lyric: z
            .string()
            .max(1000, messages('validation.max', { number: 1000 }))
            .optional()
            .nullable(),
        trackTypeId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        audioFile: z
            .object({
                id: z.string().optional(),
                sampleRate: z.string().optional(),
                bitrate: z.string().nullable().optional(),
                bitDepth: z.number().nullable().optional(),
                duration: z.number().nullable().optional(),
                format: z.string().nullable().optional(),
                file: z.object({
                    fileName: z
                        .string()
                        .max(100, messages('validation.max', { number: 100 })),
                    urlRead: z.string().nullable().optional(),
                }),
                sampleLength: z
                    .number({
                        required_error: messages('validation.input'),
                        invalid_type_error: messages('validation.input'),
                    })
                    .nullable()
                    .refine((val) => val !== null && val !== 0, {
                        message: messages('validation.input'),
                    }),
                preview: z
                    .number({
                        required_error: messages('validation.input'),
                        invalid_type_error: messages('validation.input'),
                    })
                    .nullable()
                    .refine((val) => val !== null && val !== 0, {
                        message: messages('validation.input'),
                    }),
            })
            .superRefine((data, ctx) => {
                if (
                    data.preview != null &&
                    data.duration != null &&
                    data.preview >= data.duration
                ) {
                    ctx.addIssue({
                        path: ['preview'],
                        code: z.ZodIssueCode.custom,
                        message: messages(
                            'track.validation.previewMustBeLessThanDuration'
                        ),
                    });
                }

                if (
                    data.sampleLength != null &&
                    data.duration != null &&
                    data.preview != null &&
                    data.sampleLength > data.duration - data.preview
                ) {
                    ctx.addIssue({
                        path: ['sampleLength'],
                        code: z.ZodIssueCode.custom,
                        message: messages(
                            'track.validation.sampleLengthMustBeLessThanDuration'
                        ),
                    });
                }
            }),
    });

export type ReleaseTrackSchema = z.infer<ReturnType<typeof releaseTrackSchema>>;
