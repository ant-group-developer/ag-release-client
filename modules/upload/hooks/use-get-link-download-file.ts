import { useQuery } from '@tanstack/react-query';
import { bucketApi } from '../apis/bucket-api';

export const useGetLinkDownloadFile = (id: string) => {
    const { data, ...res } = useQuery({
        queryKey: ['download-file'],
        queryFn: () => bucketApi.getLinkDownloadFile(id),
    });

    const linkDownloadFile = data?.data?.data;

    return {
        linkDownloadFile,
        ...res,
    };
};
