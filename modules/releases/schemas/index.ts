import { ReleaseArtist } from '@/modules/release-artist/types';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { z } from 'zod';
import { RELEASES_TYPE } from '../enums';
import { ReleaseCoverArt } from '../types';
export const releaseSchema = (messages: (key: string) => string) =>
    z.object({
        upc: z.string().optional().nullable(),
        primaryGenreId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        subGenreId: z.string().optional().nullable(),
        releaseLanguage: z
            .object({
                metadataLanguageId: z
                    .string()
                    .nullable()
                    .refine((val) => val !== null && val !== '', {
                        message: messages('validation.input'),
                    }),
            })
            .nullable()
            .refine((val) => val !== null, {
                message: messages('validation.input'),
            }),
        labelId: z.string().optional().nullable(),
        catalogId: z.string().optional().nullable(),
        title: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        version: z.string().optional().nullable(),
        type: z.nativeEnum(RELEASES_TYPE, {
            required_error: messages('validation.select'),
        }),
        releaseArtists: z
            .array(z.custom<ReleaseArtist>())
            .min(1, messages('validation.input')),
        coverArtThumbnails: z.custom<ReleaseCoverArt>(),
        pLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        cLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        isVariousArtist: z.boolean(),
        releaseDate: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        releaseTime: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        releaseTimezoneId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        tracks: z
            .array(releaseTrackSchema(messages))
            .min(1, messages('validation.input')),
    });
export type ReleaseSchema = z.infer<ReturnType<typeof releaseSchema>>;
