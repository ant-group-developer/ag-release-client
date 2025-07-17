import { ReleaseArtist } from '@/modules/release-artist/types';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { z } from 'zod';
import { RELEASES_TYPE } from '../enums';
export const releaseSchema = (messages: (key: string) => string) =>
    z.object({
        coverArtThumbnails: z
            .object({
                '75x75': z.string().nullable(),
                '100x100': z.string().nullable(),
                '300x300': z.string().nullable(),
                '900x900': z.string().nullable(),
                original: z
                    .string()
                    .nullable()
                    .refine((val) => val !== null && val !== '', {
                        message: messages('validation.input'),
                    }),
            })
            .nullable()
            .refine(
                (val) =>
                    val !== null &&
                    val !== undefined &&
                    typeof val === 'object',
                {
                    message: messages('validation.input'),
                }
            ),
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
            .min(1, messages('validation.input'))
            .refine(
                (artists) =>
                    Array.isArray(artists) &&
                    artists.some(
                        (artist) =>
                            artist.artistRole &&
                            artist.artistRole.name === 'Main Artist'
                    ),
                {
                    message: messages('releases.validation.mustHaveMainArtist'),
                }
            ),
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
        releaseTerritory: z
            .object({
                distributeWorldwide: z
                    .boolean()
                    .refine((val) => val !== null && val !== undefined, {
                        message: messages('validation.input'),
                    }),
                distributeType: z.boolean().optional().nullable(),
                selectedCountries: z.array(z.string()).optional().nullable(),
            })
            .superRefine((val, ctx) => {
                if (!val.distributeWorldwide) {
                    if (
                        !val.selectedCountries ||
                        val.selectedCountries.length === 0
                    ) {
                        ctx.addIssue({
                            path: ['selectedCountries'],
                            code: z.ZodIssueCode.custom,
                            message: messages('validation.input'),
                        });
                    }
                }
                if (!val.distributeWorldwide) {
                    if (!val.distributeType) {
                        ctx.addIssue({
                            path: ['distributeType'],
                            code: z.ZodIssueCode.custom,
                            message: messages('validation.input'),
                        });
                    }
                }
            }),
        tracks: z
            .array(releaseTrackSchema(messages))
            .min(1, messages('validation.input')),
    });
export type ReleaseSchema = z.infer<ReturnType<typeof releaseSchema>>;
