import { create } from 'zustand';

interface CurrentSong {
    songId: string | null;
    fileId: number | null;
    url: string;
    isPlaying: boolean;
    currentTimePlaying: number;
    setReactPlayerRef: (ref: any) => void;
    reactPlayerRef: any;
}

export interface OnPlay {
    url: string;
    songId: string;
}

export interface OnSeek extends OnPlay {
    second: number;
}

interface PlaySongState extends CurrentSong {
    onSeek: (value: OnSeek) => void;
    onPlay: (value: OnPlay) => void;
    onStop: (stop: boolean) => void;
    setReactPlayerRef: (ref: any) => void;
    reactPlayerRef: any;
}

const defaultValue = {
    songId: null,
    fileId: null,
    url: '',
    isPlaying: false,
    currentTimePlaying: 0,
};

export const usePlaySongStore = create<PlaySongState>((set, get) => ({
    ...defaultValue,
    reactPlayerRef: null,
    setReactPlayerRef: (ref) => set({ reactPlayerRef: ref }),
    onPlay: ({ url, songId }) => {
        set((state) => ({
            ...state,
            isPlaying: true,
            url: url ?? state.url,
            songId: songId ?? state.songId,
        }));
    },
    onStop: (close) => {
        if (close) {
            set(defaultValue);
        } else {
            set((state) => ({
                ...state,
                isPlaying: false,
            }));
        }
    },
    onSeek: ({ second, url, songId }) => {
        get().reactPlayerRef?.seekTo(second, 'seconds');
        set((state) => ({
            ...state,
            isPlaying: true,
            url: url ?? state.url,
            songId: songId ?? state.songId,
            currentTimePlaying: second,
        }));
    },
}));
