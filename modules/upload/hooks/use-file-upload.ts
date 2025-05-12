import { useState } from 'react';
import { uploadApi } from '../apis';

interface UseFileUploadReturn {
    uploadFile: (file: File, folderId?: string) => Promise<string | undefined>;
    isLoading: boolean;
    error: string | null;
    fileId: string | null;
    reset: () => void;
}

export const useFileUpload = (): UseFileUploadReturn => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [fileId, setFileId] = useState<string | null>(null);

    const uploadFile = async (file: File, folderId?: string) => {
        setIsLoading(true);
        setError(null);

        try {
            const fileId = await uploadApi.uploadFileToDriveV2(file, folderId);

            if (fileId) {
                setFileId(fileId);
            }

            if (!fileId) {
                throw new Error('Upload failed');
            }

            return fileId;
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'An error occurred during upload'
            );
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const reset = () => {
        setIsLoading(false);
        setError(null);
    };

    return {
        uploadFile,
        isLoading,
        error,
        fileId,
        reset,
    };
};
