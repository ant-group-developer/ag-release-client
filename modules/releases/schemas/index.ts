import { artistSchema } from '@/modules/artist/schema';
import { z } from 'zod';
import { RELEASES_TYPE } from '../enums';
export const releaseSchema = (messages: (key: string) => string) =>
    z.object({
        upc: z.string().optional(),
        primaryGenreId: z.string().nonempty(messages('validation.input')),
        subGenreId: z.string().optional(),
        releaseLanguage: z.object({
            metadataLanguageId: z
                .string()
                .nonempty(messages('validation.input')),
        }),
        labelId: z.string().optional(),
        catalogId: z.string().optional(),
        title: z.string().nonempty(messages('validation.input')),
        version: z.string().optional(),
        type: z.nativeEnum(RELEASES_TYPE, {
            required_error: messages('validation.select'),
        }),
        releaseArtists: z.array(z.unknown()), // Check lại type
        coverArtThumbnails: z.any(), // Check lại type
        pLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nonempty(messages('validation.input')),
        cLineOwner: z
            .string()
            .min(5, messages('validation.input'))
            .nonempty(messages('validation.input')),
        isVariousArtist: z.boolean(),
        tracks: z
            .array(
                z.object({
                    trackName: z
                        .string()
                        .nonempty(messages('validation.input')),
                    version: z.string().optional(),
                    isrc: z.string().optional(),
                    trackOrigin: z
                        .string()
                        .nonempty(messages('validation.input')),
                    languageTrack: z
                        .string()
                        .nonempty(messages('validation.input')),
                    isAddArtistsFromRelease: z.boolean(),
                    trackArtists: z.array(artistSchema(messages)),
                })
            )
            .min(1, messages('validation.input')),
    });

export type ReleaseSchema = z.infer<ReturnType<typeof releaseSchema>>;
