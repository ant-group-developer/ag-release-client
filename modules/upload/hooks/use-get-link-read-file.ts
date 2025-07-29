import { useQuery } from '@tanstack/react-query';
import { bucketApi } from '../apis/bucket-api';

export const useGetLinkReadFile = (id: string) => {
    const { data, ...res } = useQuery({
        queryKey: ['read-file'],
        queryFn: () => bucketApi.getLinkReadFile(id),
        enabled: !!id,
    });

    const linkReadFile = data?.data?.data;

    return {
        linkReadFile,
        ...res,
    };
};
