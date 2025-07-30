import { useQuery } from '@tanstack/react-query';
import { bucketApi } from '../apis/bucket-api';

export const useGetLinkReadFile = (
    id: string,
    options?: { enabled?: boolean }
) => {
    const { data, ...res } = useQuery({
        queryKey: ['read-file', id],
        queryFn: () => bucketApi.getLinkReadFile(id),
        enabled: !!id && (options?.enabled ?? true),
    });

    const linkReadFile = data?.data?.data;

    return {
        linkReadFile,
        ...res,
    };
};
