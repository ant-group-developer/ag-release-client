import { z } from 'zod';

export const artistSchema = (messages: any) =>
    z.object({
        id: z.string(),
        name: z.string().nonempty('validation.input'),
        role: z.string().nonempty('validation.input'),
        // artistId: z.string(),
        // thumbnail: z.string(),
        createdAt: z.date(),
        updatedAt: z.date(),
    });

export type ArtistSchema = z.infer<ReturnType<typeof artistSchema>>;
