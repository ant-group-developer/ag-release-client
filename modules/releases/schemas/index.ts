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
        labelId: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
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
            .max(150, messages('validation.max', { number: 150 }))
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        version: z
            .string()
            .max(150, messages('validation.max', { number: 150 }))
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
            .refine((val) => val !== '' && val !== null, {
                message: messages('validation.input'),
            }),
        cLineOwner: z
            .string()
            .max(200, messages('validation.max', { number: 200 }))
            .nullable()
            .refine((val) => val !== '' && val !== null, {
                message: messages('validation.input'),
            }),
        pLineYear: z.any().refine((val) => val !== null, {
            message: messages('validation.input'),
        }),
        cLineYear: z.any().refine((val) => val !== null, {
            message: messages('validation.input'),
        }),
        isVariousArtist: z.boolean(),
        releaseTimeMode: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        releaseDate: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        releaseOriginalDate: z
            .string()
            .nullable()
            .refine((val) => val !== null && val !== '', {
                message: messages('validation.input'),
            }),
        releaseEndDate: z
            .string()
            .optional()
            .nullable(),

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

export const releaseDetailSchema = (messages: any) =>
    releaseSchema(messages).pick({
        upc: true,
        primaryGenreId: true,
        subGenreId: true,
        releaseLanguage: true,
        labelId: true,
        catalogId: true,
        title: true,
        version: true,
        releaseArtists: true,
        albumFormatId: true,
        // coverArtThumbnails: true,
        pLineOwner: true,
        pLineYear: true,
        cLineYear: true,
        cLineOwner: true,
        isVariousArtist: true,
    });
// .superRefine((data, ctx) => {
// Validate releaseArtists chỉ khi isVariousArtist là false
//     if (!data.isVariousArtist) {
//         if (
//             !Array.isArray(data.releaseArtists) ||
//             data.releaseArtists.length < 1
//         ) {
//             ctx.addIssue({
//                 path: ['releaseArtists'],
//                 code: z.ZodIssueCode.custom,
//                 message: messages('validation.input'),
//             });
//         } else if (data.releaseArtists.length <= 0) {
//             ctx.addIssue({
//                 path: ['releaseArtists'],
//                 code: z.ZodIssueCode.custom,
//                 message: messages(
//                     'release.validation.mustHaveMainArtist'
//                 ),
//             });
//         }
//     }
// });

export type ReleaseDetailSchema = z.infer<
    ReturnType<typeof releaseDetailSchema>
>;
