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
    songTimeMap: Map<string, number>;
    isSeeking: boolean;
    pendingSeekTime: number | null;
    pendingAutoPlay: boolean;
    setPendingSeekTime: (second: number | null) => void;
    setPendingAutoPlay: (value: boolean) => void;
}

const defaultValue = {
    songId: null,
    fileId: null,
    url: '',
    isPlaying: false,
    currentTimePlaying: 0,
    isSeeking: false,
    pendingSeekTime: null,
    pendingAutoPlay: false,
};

export const usePlaySongStore = create<PlaySongState>((set, get) => ({
    ...defaultValue,
    reactPlayerRef: null,
    songTimeMap: new Map(),
    setReactPlayerRef: (ref) => set({ reactPlayerRef: ref }),
    setPendingSeekTime: (second) => set({ pendingSeekTime: second }),
    setPendingAutoPlay: (value) => set({ pendingAutoPlay: value }),

    onPlay: ({ url, songId }) => {
        const state = get();
        const savedTime = state.songTimeMap.get(songId) || 0;

        set((prevState) => ({
            ...prevState,
            isPlaying: true,
            url: url ?? prevState.url,
            songId: songId ?? prevState.songId,
            currentTimePlaying: savedTime,
            pendingSeekTime: savedTime,
            pendingAutoPlay: false,
        }));
    },

    onStop: (close) => {
        const state = get();
        if (close) {
            set(defaultValue);
            return;
        }

        if (state.songId) {
            state.songTimeMap.set(state.songId, state.currentTimePlaying);
        }

        set((prevState) => ({
            ...prevState,
            isPlaying: false,
            pendingAutoPlay: false,
        }));
    },

    onSeek: ({ second, url, songId }) => {
        const state = get();
        const shouldDeferPlayback =
            state.songId !== songId ||
            state.url !== url ||
            !state.reactPlayerRef;

        state.songTimeMap.set(songId, second);

        set((prevState) => ({
            ...prevState,
            isPlaying: shouldDeferPlayback ? false : true,
            isSeeking: true,
            url: url ?? prevState.url,
            songId: songId ?? prevState.songId,
            currentTimePlaying: second,
            pendingSeekTime: second,
            pendingAutoPlay: shouldDeferPlayback,
        }));
    },
}));
