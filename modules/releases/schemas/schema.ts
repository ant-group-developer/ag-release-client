import { z } from 'zod';
export const releaseSchema = (messages: (key: string) => string) =>
    z.object({
        type: z.string().nonempty(messages('validation.select')),
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
            .nonempty('At least one artist is required'),
        genres: z.string().nonempty(messages('validation.select')),
        subGenres: z.string().optional(),
        language: z.string().nonempty(messages('validation.select')),
        label: z.string().optional(),
        upc: z.string().nonempty('UPC is required'),
        catalogId: z.string().optional(),
        cLineYear: z.string().nonempty('Copy right is required'),
        pLineYear: z.string().nonempty('Copy right 2 is required'),
        thumbnail: z.object({
            fileList: z.array(
                z.object({
                    uid: z.string(),
                    name: z.string(),
                    status: z.string(),
                    url: z.string(),
                    thumbUrl: z.string(),
                })
            ),
        }),
        tracks: z.array(
            z.object({
                title: z.string().nonempty('Track is required'),
                isrc: z.string().nonempty('ISRC is required'),
                mainArtist: z.string().nonempty('Main artist is required'),
                originalSource: z
                    .string()
                    .nonempty('Original source is required'),
                languageTrack: z.string().nonempty('Language is required'),
                genres: z.string().nonempty('Genres is required'),
                subGenres: z.string().optional(),
                sensitiveContent: z.boolean(),
                countryLanguage: z
                    .string()
                    .nonempty('Country language is required'),
                MetadataLanguage: z.string().nonempty('Language is required'),
                lyrics: z.string().optional(),
                audioSpecifications: z.object({
                    format: z.string().nonempty('Format is required'),
                    codec: z.string().nonempty('Codec is required'),
                    bitrate: z
                        .number()
                        .nonnegative('Bitrate must be non-negative'),
                    sampleRate: z
                        .number()
                        .nonnegative('Sample rate must be non-negative'),
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
                    fileName: z.string().nonempty('File name is required'),
                    registeredFilename: z
                        .string()
                        .nonempty('Registered filename is required'),
                    countryRecording: z
                        .string()
                        .nonempty('Country recording is required'),
                    previewTrack: z
                        .string()
                        .nonempty('Preview track is required'),
                }),
                publishing: z.object({
                    publishingType: z
                        .string()
                        .nonempty('Publishing type is required'),
                    publisherName: z
                        .string()
                        .nonempty('Publisher name is required'),
                    role: z.string().nonempty('Role is required'),
                    musicianName: z
                        .string()
                        .nonempty('Musician name is required'),
                    percent: z
                        .number()
                        .nonnegative('Percent must be non-negative'),
                }),
            })
        ),
    });

export type ReleaseSchema = z.infer<ReturnType<typeof releaseSchema>>;
