import { GENRES } from '@/modules/tracks/enums';
import { z } from 'zod';
import { RELEASES_TYPE } from '../enums';
export const releaseSchema = (messages: (key: string) => string) =>
    z.object({
        releaseType: z
            .nativeEnum(RELEASES_TYPE)
            .nullable()
            .refine((val) => val !== null, {
                message: messages('validation.input'),
            }),
        nameRelease: z.string().nonempty(messages('validation.input')),
        version: z.string().optional(),
        isMoreThan4Artists: z.boolean(),
        artists: z
            .array(
                z.object({
                    name: z.string().nonempty(messages('validation.select')),
                    role: z.string().nonempty(messages('validation.select')),
                })
            )
            .nonempty(messages('validation.input')),
        genres: z
            .nativeEnum(GENRES)
            .nullable()
            .refine((val) => val !== null, {
                message: messages('validation.input'),
            }),
        subGenres: z.string().optional(),
        metaDataLanguage: z.string().nonempty(messages('validation.select')),
        label: z.string().optional(),
        catalogId: z.string().optional(),
        cLineYear: z.string().nonempty(messages('validation.input')),
        pLineYear: z.string().nonempty(messages('validation.input')),
        releaseDate: z.string().nonempty(messages('validation.input')),
        territoryType: z
            .array(z.string())
            .nonempty(messages('validation.select')),
        timezone: z.string().nonempty(messages('validation.input')),
        // thumbnail: z.object({
        //     fileList: z.array(
        //         z.object({
        //             uid: z.string(),
        //             name: z.string(),
        //             status: z.string(),
        //             url: z.string(),
        //             thumbUrl: z.string(),
        //         })
        //     ),
        // }),
        tracks: z
            .array(
                z.object({
                    trackName: z
                        .string()
                        .nonempty(messages('validation.input')),
                    isrc: z.string().optional(),
                    artists: z
                        .array(
                            z.object({
                                name: z
                                    .string()
                                    .nonempty(messages('validation.select')),
                                role: z
                                    .string()
                                    .nonempty(messages('validation.select')),
                            })
                        )
                        .nonempty(messages('validation.input')),
                    source: z.string().nonempty(messages('validation.input')),
                    languageTrack: z
                        .string()
                        .nonempty(messages('validation.input')),
                    genres: z.string().nonempty(messages('validation.input')),
                    subGenres: z.string().optional(),
                    isSensitiveContent: z.boolean(),
                    countryRecording: z
                        .string()
                        .nonempty(messages('validation.input')),
                    recordingType: z
                        .string()
                        .nonempty(messages('validation.input')),
                    countryLanguage: z
                        .string()
                        .nonempty(messages('validation.input')),
                    metadataLanguage: z
                        .string()
                        .nonempty(messages('validation.input')),
                    lyrics: z.string().optional(),
                    fileData: z.object({
                        fileName: z
                            .string()
                            .nonempty(messages('validation.input')),
                        metadata: z.object({
                            format: z
                                .string()
                                .nonempty(messages('validation.input')),
                            codec: z
                                .string()
                                .nonempty(messages('validation.input')),
                            bitrate: z
                                .number()
                                .nonnegative('Bitrate must be non-negative'),
                            sampleRate: z
                                .number()
                                .nonnegative(
                                    'Sample rate must be non-negative'
                                ),
                            channels: z
                                .number()
                                .nonnegative('Channels must be non-negative'),
                            duration: z
                                .number()
                                .nonnegative('Duration must be non-negative'),
                            bitDepth: z
                                .number()
                                .nonnegative('Bit depth must be non-negative'),
                            mqs: z.string().nonempty('MQS is required'),
                        }),
                    }),
                })
            )
            .min(1, messages('validation.input')),
    });

export type ReleaseSchema = z.infer<ReturnType<typeof releaseSchema>>;
