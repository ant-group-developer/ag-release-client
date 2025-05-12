// import { AppPopover } from '@/components/shared/app-popover';
// import { Chip } from '@/components/ui/chip';
// import RadioComponent from '@/components/ui/radio/filter-radio';
// import { TYPE_FILTER } from '@/enums/common';
// import { toNonAccentVietnamese } from '@/helpers/string';
// import { useState } from 'react';
// import { useGetCountOrderCreator } from '../../hooks/use-get-count-creator';

// type Props<T extends Record<string, any>> = {
//     handleChangeTypeFilter: (value?: TYPE_FILTER) => void;
//     open: boolean;
//     title: React.ReactNode;
//     dataFilter: T;
//     onChangeFilter: (value?: any) => void;
// };

// const OrderCreatorCountDialog = <T extends Record<string, any>>({
//     open,
//     title,
//     dataFilter,
//     onChangeFilter,
//     handleChangeTypeFilter,
// }: Props<T>) => {
//     const [value, setValue] = useState<string>('');
//     const [keyword, setKeyword] = useState<string>();

//     const { countCreatorData, isFetching } = useGetCountOrderCreator(
//         dataFilter,
//         open || !!dataFilter.creatorId
//     );

//     const dataFiltered = countCreatorData.filter((item) =>
//         toNonAccentVietnamese(item.name)
//             .toLowerCase()
//             .includes(toNonAccentVietnamese(keyword).toLowerCase())
//     );

//     const selectedUser = countCreatorData.find(
//         (item) => item.id === dataFilter.creatorId
//     );

//     const onCancel = () => {
//         handleChangeTypeFilter();
//     };

//     const onSubmit = () => {
//         onChangeFilter({
//             creatorId: value,
//         });
//         onCancel();
//     };

//     if (!dataFilter.creatorId && !open) return null;

//     return (
//         <div className="relative">
//             {dataFilter.creatorId && (
//                 <Chip
//                     onClick={() => handleChangeTypeFilter(TYPE_FILTER.CREATOR)}
//                     onRemove={() => onChangeFilter({ creatorId: undefined })}
//                 >
//                     {title}: {selectedUser?.name}
//                 </Chip>
//             )}

//             <AppPopover
//                 className="top-[41px]"
//                 open={open}
//                 title={title}
//                 showFooter
//                 submitProps={{
//                     className: value ? '' : 'opacity-50 cursor-not-allowed ',
//                     disabled: !value,
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
//                     <RadioComponent
//                         searchWords={keyword}
//                         value={value}
//                         onChange={(e) => setValue(e.target.value)}
//                         data={dataFiltered.map((item) => ({
//                             name: item.name,
//                             value: item.id,
//                             // count: item.count,
//                         }))}
//                     />
//                 </div>
//             </AppPopover>
//         </div>
//     );
// };

// export default OrderCreatorCountDialog;
