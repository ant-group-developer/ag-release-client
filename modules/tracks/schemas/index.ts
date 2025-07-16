import { TrackArtistData } from '@/modules/track-artist/types';
import { z } from 'zod';

export const releaseTrackSchema = (messages: any) =>
    z.object({
        title: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        version: z.string().optional().nullable(),
        isrc: z.string().optional().nullable(),
        iswc: z.string().optional().nullable(),
        pLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        primaryGenreId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        subGenreId: z.string().optional().nullable(),
        originTypeId: z
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
        isSensitiveContent: z.boolean().optional(),
        lyric: z.string().optional().nullable(),
        trackTypeId: z
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
        preview: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
    });

export type ReleaseTrackSchema = z.infer<ReturnType<typeof releaseTrackSchema>>;
