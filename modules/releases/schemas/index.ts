import { ReleaseArtist } from '@/modules/release-artist/types';
import { releaseTrackSchema } from '@/modules/tracks/schemas';
import { z } from 'zod';
export const releaseSchema = (messages: any) =>
    z.object({
        coverArtThumbnails: z
            .object({
                '75x75': z.string().nullable(),
                '100x100': z.string().nullable(),
                '160x160': z.string().nullable(),
                '300x300': z.string().nullable(),
                '900x900': z.string().nullable(),
                original: z
                    .string()
                    .nullable()
                    .refine((val) => val !== null && val !== '', {
                        message: messages('validation.input'),
                    }),
            })
            .refine(
                (val) =>
                    val !== null &&
                    val !== undefined &&
                    typeof val === 'object',
                {
                    message: messages('validation.input'),
                }
            ),
        upc: z
            .string()
            .max(20, messages('validation.max', { number: 20 }))
            .optional()
            .nullable(),
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
                    .min(1, { message: messages('validation.input') }),
                metadataLanguageCountryId: z
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
            })
            .refine((val) => val !== null, {
                message: messages('validation.input'),
            }),
        labelId: z.string().refine((val) => val !== null && val !== '', {
            message: messages('validation.input'),
        }),
        catalogId: z
            .string()
            .max(100, messages('validation.max', { number: 100 }))
            .optional()
            .nullable(),
        title: z
            .string()
            .min(1, messages('validation.min', { number: 1 }))
            .max(100, messages('validation.max', { number: 100 }))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        version: z
            .string()
            .max(50, messages('validation.max', { number: 50 }))
            .optional()
            .nullable(),
        albumFormatId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        releaseArtists: z.array(z.custom<ReleaseArtist>()).optional(),
        // .min(1, messages('validation.input')) Đã validate ở detail schema
        // .refine(
        //     (artists) =>
        //         Array.isArray(artists) &&
        //         artists.some(
        //             (artist) =>
        //                 artist.artistRole &&
        //                 artist.artistRole.name === 'Main Artist'
        //         ),
        //     {
        //         message: messages('release.validation.mustHaveMainArtist'),
        //     }
        // ),
        pLineOwner: z
            .string()
            .max(200, messages('validation.max', { number: 200 }))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        cLineOwner: z
            .string()
            .max(200, messages('validation.max', { number: 200 }))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        pLineYear: z
            .number()
            .optional()
            .refine((val) => val !== null || val !== undefined, {
                message: messages('validation.input'),
            }),
        cLineYear: z
            .number()
            .optional()
            .refine((val) => val !== null || val !== undefined, {
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
                distributionType: z.string().optional().nullable(),
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
                    if (!val.distributionType) {
                        ctx.addIssue({
                            path: ['distributionType'],
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
