import DateRangePicker from '@/components/ui/input/date-range-picker';
import NewsCategorySelect from '@/components/ui/select/news-category-select';
import { UseFilterProps } from '@/hooks/use-filter';
import { useTableLayoutToggle } from '@/hooks/use-layout-table';
import useModalStore from '@/hooks/use-modal';
import { ProForm, ProFormText, QueryFilter } from '@ant-design/pro-components';
import { Select } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';
import { NEWS_STATUS } from '../../enums';
import { useGetListKeywords } from '../../hooks/use-get-keywords';
import { NewsDataFilter } from '../../types';

type Props = Pick<
    UseFilterProps<NewsDataFilter>,
    | 'dataFilter'
    | 'onSearch'
    | 'canClearFilter'
    | 'onChangeFilter'
    | 'removeFilter'
>;

export const NewsHeaderV2 = ({
    dataFilter,
    onChangeFilter,
    canClearFilter,
    onSearch,
    removeFilter,
}: Props) => {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);
    const { layoutTable, toggleLayoutTable } = useTableLayoutToggle();

    const { keywordsData } = useGetListKeywords();
    const [form] = ProForm.useForm();
    const statusOptions = [
        {
            label: messages('common.public'),
            value: NEWS_STATUS.PUBLIC,
        },
        {
            label: messages('common.private'),
            value: NEWS_STATUS.PRIVATE,
        },
    ];

    const option =
        keywordsData?.map((item) => ({ label: item, value: item })) || [];

    const initialValue = {
        ...dataFilter,
    };

    const handleSubmit = (values: any) => {
        const { dateCreated, dateUpdated, ...res } = values;
        const params = {
            ...res,
        };
        if (dateCreated && dateCreated.length) {
            params.startCreatedAt = dateCreated[0];
            params.endCreatedAt = dateCreated[1];
        }

        if (dateUpdated && dateUpdated.length) {
            params.startUpdatedAt = dateUpdated[0];
            params.endUpdatedAt = dateUpdated[1];
        }

        onChangeFilter(params);
    };

    const handleReset = (values: any) => {
        removeFilter();
        form.setFieldsValue({});
    };

    useEffect(() => {
        form.setFieldsValue(initialValue);
    }, []);

    return (
        <div className="app-header mb-4">
            <QueryFilter
                className="rounded-md bg-white"
                form={form}
                onFinish={handleSubmit}
                onReset={handleReset}
                layout="vertical"
                submitter={{
                    searchConfig: {
                        submitText: messages('common.search'),
                        resetText: messages('common.clearFilter'),
                    },
                }}
            >
                <ProFormText
                    name="title"
                    label={messages('common.search')}
                    placeholder={messages('placeholder.searchBy')}
                />
                <ProForm.Item
                    name="newsCategoryId"
                    label={messages('newsCategory.label')}
                >
                    <NewsCategorySelect
                        mode="multiple"
                        allowClear
                        placeholder={messages('placeholder.filterBy')}
                    />
                </ProForm.Item>

                <ProForm.Item name="status" label={messages('common.status')}>
                    <Select
                        mode="multiple"
                        allowClear
                        options={statusOptions}
                        placeholder={messages('placeholder.filterBy')}
                    />
                </ProForm.Item>
                <ProForm.Item
                    name="keywords"
                    label={messages('common.keyword')}
                >
                    <Select
                        // defaultValue={value}
                        onMouseDown={(e) => e.stopPropagation()}
                        // onChange={(e) => setValue(e)}
                        allowClear
                        mode="tags"
                        className="min-w-72"
                        placeholder={messages('placeholder.filterBy')}
                        options={option}
                        popupMatchSelectWidth={false}
                        dropdownStyle={{ zIndex: 9999 }}
                        getPopupContainer={(triggerNode) =>
                            (triggerNode.closest(
                                '.ant-popover'
                            ) as HTMLElement) || document.body
                        }
                    />
                </ProForm.Item>
                <ProForm.Item
                    name="dateCreated"
                    label={messages('common.dateCreated')}
                >
                    <DateRangePicker
                        className="w-full"
                        allowClear
                        // value={
                        //     tempStartDate && tempEndDate
                        //         ? [dayjs(tempStartDate), dayjs(tempEndDate)]
                        //         : undefined
                        // }
                        // externalOnChange={handleDateChange}
                        placement="topLeft"
                        // disabledDate={(current) =>
                        //     current && current > dayjs().endOf('day')
                        // }
                    />
                </ProForm.Item>
                <ProForm.Item
                    name="dateUpdated"
                    label={messages('common.dateUpdated')}
                >
                    <DateRangePicker
                        allowClear
                        className="w-full"
                        // value={
                        //     tempStartDate && tempEndDate
                        //         ? [dayjs(tempStartDate), dayjs(tempEndDate)]
                        //         : undefined
                        // }
                        // externalOnChange={handleDateChange}
                        placement="topLeft"
                        // disabledDate={(current) =>
                        //     current && current > dayjs().endOf('day')
                        // }
                    />
                </ProForm.Item>
            </QueryFilter>
            {/* <div className="flex justify-end gap-2 border-b py-2"> */}
            {/* <TableLayoutSegmented
                    className="!mr-2"
                    value={layoutTable}
                    onChange={toggleLayoutTable}
                /> */}
            {/* <CreateButton
                    canCreate={true}
                    text={messages('action.create.button')}
                    onClick={() => openModal(TYPE_MODAL_NEWS.CREATE)}
                />
            </div> */}
        </div>
    );
};
