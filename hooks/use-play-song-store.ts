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
}

const defaultValue = {
    songId: null,
    fileId: null,
    url: '',
    isPlaying: false,
    currentTimePlaying: 0,
    isSeeking: false,
};

export const usePlaySongStore = create<PlaySongState>((set, get) => ({
    ...defaultValue,
    reactPlayerRef: null,
    songTimeMap: new Map(),
    setReactPlayerRef: (ref) => set({ reactPlayerRef: ref }),

    onPlay: ({ url, songId }) => {
        const state = get();
        const savedTime = state.songTimeMap.get(songId) || 0;

        set((state) => ({
            ...state,
            isPlaying: true,
            url: url ?? state.url,
            songId: songId ?? state.songId,
            currentTimePlaying: savedTime,
        }));
    },

    onStop: (close) => {
        const state = get();
        if (close) {
            set(defaultValue);
        } else {
            // Lưu thời gian hiện tại của bài hát trước khi dừng
            if (state.songId) {
                state.songTimeMap.set(state.songId, state.currentTimePlaying);
            }
            set((state) => ({
                ...state,
                isPlaying: false,
            }));
        }
    },

    onSeek: ({ second, url, songId }) => {
        const state = get();
        console.log('🚀 ~ const:', state);
        state.songTimeMap.set(songId, second);
        set((state) => ({
            ...state,
            isPlaying: true,
            isSeeking: true,
            url: url ?? state.url,
            songId: songId ?? state.songId,
            currentTimePlaying: second,
        }));
        get().reactPlayerRef?.seekTo(second, 'seconds');
        console.log(
            "🚀 ~ get().reactPlayerRef?.seekTo(second, 'seconds'):",
            get().reactPlayerRef?.seekTo(second, 'seconds')
        );
    },
}));
