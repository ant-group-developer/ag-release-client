// import { AppPopover } from '@/components/shared/app-popover';
// import FilterCheckbox from '@/components/ui/checkbox/filter-count-checkbox';
// import { Chip } from '@/components/ui/chip';
// import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
// import { TYPE_FILTER } from '@/enums/common';
// import { toNonAccentVietnamese } from '@/helpers/string';
// import { useGetListArtist } from '@/modules/artist/hooks/use-get-list-artists';
// import { CommonDataSidebar } from '@/types/api';
// import { useTranslations } from 'next-intl';
// import { useEffect, useState } from 'react';

// type Props = {
//     handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
//     open: boolean;
//     title: React.ReactNode;
//     dataFilter: any;
//     onChangeFilter: (value?: any) => void;
// };

// const ArtistDialog = ({
//     open,
//     title,
//     dataFilter,
//     onChangeFilter,
//     handleChangeTypeFilter,
// }: Props) => {
//     const messages = useTranslations();
//     const [value, setValue] = useState<string>('');
//     const [keyword, setKeyword] = useState<string>();

//     const { artistsData, isFetching } = useGetListArtist({
//         pageSize: PAGE_SIZE_EXTRA_LARGE,
//     });

//     const dataFiltered = artistsData?.items?.filter((item) =>
//         toNonAccentVietnamese(item.name)
//             .toLowerCase()
//             .includes(toNonAccentVietnamese(keyword).toLowerCase())
//     );

//     const getSelectedArtistText = () => {
//         if (!dataFilter.artistId) return '';

//         const artist = artistsData?.items?.find(
//             (item) => item.id === dataFilter.artistId
//         );

//         return `${artist?.name}`;
//     };

//     const onCancel = () => {
//         handleChangeTypeFilter();
//     };

//     const onSubmit = () => {
//         onChangeFilter({
//             artistId: value,
//         });
//         onCancel();
//     };

//     useEffect(() => {
//         if (dataFilter.artistId) {
//             setValue(dataFilter.artistId);
//         } else {
//             setValue('');
//         }
//     }, [dataFilter.artistId]);

//     if (!dataFilter.artistId && !open) return null;

//     return (
//         <div className="relative">
//             {dataFilter.artistId && (
//                 <Chip
//                     onClick={() =>
//                         handleChangeTypeFilter(TYPE_FILTER.ARTIST_ID)
//                     }
//                     onRemove={() => onChangeFilter({ artistId: undefined })}
//                 >
//                     <CustomTooltip title={getSelectedArtistText()}>
//                         {title}: {getSelectedArtistText()}
//                     </CustomTooltip>
//                 </Chip>
//             )}

//             <AppPopover
//                 className="top-[41px]"
//                 open={open}
//                 title={title}
//                 showFooter
//                 submitProps={{
//                     className: value.length
//                         ? ''
//                         : 'opacity-50 cursor-not-allowed',
//                     disabled: !value.length,
//                     onClick: onSubmit,
//                 }}
//                 onCancel={onCancel}
//                 loading={isFetching}
//                 inputProps={{
//                     value: keyword,
//                     onChange: (e) => setKeyword(e.target.value),
//                 }}
//                 showInput
//             >
//                 <div className="mt-2 max-h-80 overflow-y-auto">
//                     <FilterCheckbox
//                         searchWords={keyword}
//                         data={dataFiltered?.map((item: CommonDataSidebar) => ({
//                             name: item.name,
//                             value: item.id,
//                         }))}
//                         value={value}
//                         onChange={(newValue) => setValue(newValue)}
//                     />
//                 </div>
//             </AppPopover>
//         </div>
//     );
// };

// export default ArtistDialog;
