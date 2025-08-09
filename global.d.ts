import en from './messages/en.json';
import { UserData } from './modules/user/types/data';

type Messages = typeof en;

declare global {
    // Use type safe message keys with `next-intl`
    interface IntlMessages extends Messages {}
}

declare module 'mediainfo.js' {
    /**
     * Kết quả trả về từ analyzeData().
     * Mỗi track trong mảng track có thể là "General", "Video", "Audio"...
     */
    export interface MediaInfoResult {
        media?: {
            track?: Array<Record<string, any>>;
        };
    }

    export interface MediaInfoInstance {
        /**
         * analyzeData đọc file theo chunk.
         * - getSize: hàm trả về kích thước file (byte)
         * - readChunk: hàm đọc một phần (chunk) của file => trả về Uint8Array
         */
        analyzeData(
            getSize: () => number,
            readChunk: (
                chunkSize: number,
                offset: number
            ) => Promise<Uint8Array> | Uint8Array
        ): Promise<MediaInfoResult>;
    }

    /**
     * Khởi tạo MediaInfo (WebAssembly)
     */
    export default function MediaInfo(
        options?: Record<string, any>
    ): Promise<MediaInfoInstance>;
}

declare module 'next-auth' {
    interface Session {
        user: Pick<UserData, 'id' | 'email'>;
        // accessToken: string;
        error?: string;
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        accessToken: string;
        refreshToken: string;
        error?: string;
    }
}
