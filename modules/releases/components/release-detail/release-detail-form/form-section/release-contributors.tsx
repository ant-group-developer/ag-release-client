// import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
// import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
// import { ReleaseDetailSchema } from '@/modules/releases/schemas';
// import { useTranslations } from 'next-intl';
// import { useFormContext } from 'react-hook-form';
// import ReleaseContributorsTable from '../../../table/release-contributors-table';
// type Props = {
//     debouncedUpdate: (data: any, fieldName?: string) => void;
//     isReadMode: boolean;
// };

// export default function ReleaseContributorsSection({
//     isReadMode,
//     debouncedUpdate,
// }: Props) {
//     // hook - state
//     const {
//         control,
//         formState: { errors },
//         watch,
//     } = useFormContext<ReleaseDetailSchema>();
//     const formValues = useReleaseFormStore((state) => state.formValues);
//     const { releaseData } = useGetDetailRelease(formValues?.id as string);
//     const messages = useTranslations();
//     // const openModal = useModalStore((state) => state.openModal);
//     // const { action } = useGetReleaseDetailRoute();

//     // router - params
//     // const params = useParams();
//     // // const isReadMode = useMemo(
//     // //     () => action !== RELEASE_DETAIL_ACTION.EDIT,
//     // //     [action]
//     // // );

//     // variables
//     const releaseContributor = releaseData.releaseContributors || [];

//     // func

//     return (
//         <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
//             <span className="text-base font-semibold">
//                 {messages('release.contributors')}
//             </span>
//             <div className="" id="releaseContributors">
//                 <ReleaseContributorsTable
//                     dataSource={releaseContributor}
//                     disabled={isReadMode}
//                 />
//             </div>
//         </div>
//     );
// }
