// import FormItem from '@/components/ui/react-hook-form/form-item';
// import CountrySelect from '@/components/ui/select/country-select';
// import GenresSelect from '@/components/ui/select/genres-select';
// import LanguageSelect from '@/components/ui/select/language-select';
// import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
// import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
// import { ReleaseDetailSchema } from '@/modules/releases/schemas';
// import { useTranslations } from 'next-intl';
// import { useParams } from 'next/navigation';
// import { Controller, useFormContext } from 'react-hook-form';
// type Props = {
//     debouncedUpdate: (data: any, fieldName?: string) => void;
//     isReadMode: boolean;
// };

// export default function GenreLanguageSection({
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
//     const messages = useTranslations();
//     const { action } = useGetReleaseDetailRoute();

//     // router - params
//     const params = useParams();
//     // const isReadMode = useMemo(
//     //     () => action !== RELEASE_DETAIL_ACTION.EDIT,
//     //     [action]
//     // );

//     // variables
//     const isCreateReleasePage = params['action'] === 'create';

//     return (
//         <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
//             <span className="text-base font-semibold">
//                 {messages('genre.label')} & {messages('language.label')}
//             </span>
//             <div className="grid grid-cols-3 items-center gap-4">
//                 <FormItem
//                     name="primaryGenreId"
//                     label={messages('genres.primary')}
//                     required
//                     ErrorMessage={errors.primaryGenreId?.message}
//                     tooltipInfor={messages('tooltipForm.primaryGenre')}
//                 >
//                     <Controller
//                         control={control}
//                         name="primaryGenreId"
//                         render={({ field: { ref, ...field } }) => {
//                             return (
//                                 <GenresSelect
//                                     showSearch
//                                     className="w-full"
//                                     id="primaryGenreId"
//                                     {...field}
//                                     onChange={(e) => {
//                                         field.onChange(e);
//                                         debouncedUpdate({
//                                             primaryGenreId: e,
//                                         });
//                                     }}
//                                     status={
//                                         errors.primaryGenreId
//                                             ? 'error'
//                                             : undefined
//                                     }
//                                     disabled={isCreateReleasePage || isReadMode}
//                                 />
//                             );
//                         }}
//                     />
//                 </FormItem>

//                 <FormItem
//                     name="subGenreId"
//                     label={messages('common.subGenres')}
//                     ErrorMessage={errors.subGenreId?.message}
//                     tooltipInfor={messages('tooltipForm.subGenre')}
//                 >
//                     <Controller
//                         control={control}
//                         name="subGenreId"
//                         render={({ field: { ref, ...field } }) => (
//                             <GenresSelect
//                                 className="w-full"
//                                 allowClear
//                                 showSearch
//                                 id="subGenres"
//                                 {...field}
//                                 onChange={(e) => {
//                                     field.onChange(e);
//                                     debouncedUpdate({
//                                         subGenreId: e,
//                                     });
//                                 }}
//                                 status={errors.subGenreId ? 'error' : undefined}
//                                 disabled={isCreateReleasePage || isReadMode}
//                             />
//                         )}
//                     />
//                 </FormItem>

//                 <FormItem
//                     name="releaseLanguage.metadataLanguageId"
//                     label={`${messages('common.language')} metadata`}
//                     required
//                     ErrorMessage={
//                         errors.releaseLanguage?.metadataLanguageId?.message
//                     }
//                     tooltipInfor={messages('tooltipForm.metadataLanguage')}
//                 >
//                     <Controller
//                         control={control}
//                         name="releaseLanguage.metadataLanguageId"
//                         render={({ field: { ref, ...field } }) => {
//                             return (
//                                 <LanguageSelect
//                                     className="w-full"
//                                     id="releaseLanguage.metadataLanguageId"
//                                     {...field}
//                                     onChange={(e) => {
//                                         field.onChange(e);
//                                         debouncedUpdate({
//                                             releaseLanguage: {
//                                                 metadataLanguageId: e,
//                                             },
//                                         });
//                                     }}
//                                     status={
//                                         errors.releaseLanguage
//                                             ?.metadataLanguageId
//                                             ? 'error'
//                                             : undefined
//                                     }
//                                     disabled={isCreateReleasePage || isReadMode}
//                                 />
//                             );
//                         }}
//                     />
//                 </FormItem>

//                 <FormItem
//                     name="releaseLanguage.audioLanguageId"
//                     label={`${messages('track.language')}`}
//                     required
//                     ErrorMessage={
//                         errors.releaseLanguage?.audioLanguageId?.message
//                     }
//                     tooltipInfor={messages('tooltipForm.languageTrack')}
//                 >
//                     <Controller
//                         control={control}
//                         name="releaseLanguage.audioLanguageId"
//                         render={({ field: { ref, ...field } }) => {
//                             return (
//                                 <LanguageSelect
//                                     className="w-full"
//                                     id="releaseLanguage.audioLanguageId"
//                                     showSearch
//                                     {...field}
//                                     onChange={(e) => {
//                                         field.onChange(e);
//                                         debouncedUpdate({
//                                             releaseLanguage: {
//                                                 audioLanguageId: e,
//                                             },
//                                         });
//                                     }}
//                                     status={
//                                         errors.releaseLanguage?.audioLanguageId
//                                             ? 'error'
//                                             : undefined
//                                     }
//                                     disabled={isCreateReleasePage || isReadMode}
//                                 />
//                             );
//                         }}
//                     />
//                 </FormItem>

//                 <FormItem
//                     name="releaseLanguage.metadataLanguageCountryId"
//                     label={`Metadata ${messages('country.language').toLowerCase()}`}
//                     required
//                     ErrorMessage={
//                         errors.releaseLanguage?.metadataLanguageCountryId
//                             ?.message
//                     }
//                     tooltipInfor={messages('tooltipForm.countryLanguage')}
//                 >
//                     <Controller
//                         control={control}
//                         name="releaseLanguage.metadataLanguageCountryId"
//                         render={({ field: { ref, ...field } }) => {
//                             return (
//                                 <CountrySelect
//                                     className="w-full"
//                                     id="releaseLanguage.metadataLanguageCountryId"
//                                     showSearch
//                                     {...field}
//                                     onChange={(e) => {
//                                         field.onChange(e);
//                                         debouncedUpdate({
//                                             releaseLanguage: {
//                                                 metadataLanguageCountryId: e,
//                                             },
//                                         });
//                                     }}
//                                     status={
//                                         errors.releaseLanguage
//                                             ?.metadataLanguageCountryId
//                                             ? 'error'
//                                             : undefined
//                                     }
//                                     disabled={isCreateReleasePage || isReadMode}
//                                 />
//                             );
//                         }}
//                     />
//                 </FormItem>
//             </div>
//         </div>
//     );
// }
