import FormItem from '@/components/ui/react-hook-form/form-item';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { useMemo } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { ReleaseDetailSchema } from '..';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
};

export default function CodesSection({ debouncedUpdate }: Props) {
    // hook - state
    const messages = useTranslations();
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const { action } = useGetReleaseDetailRoute();

    // router - params
    const params = useParams();
    const isReadMode = useMemo(
        () => action !== RELEASE_DETAIL_ACTION.EDIT,
        [action]
    );
    const isCreateReleasePage = params['action'] === 'create';

    return (
        <CollapseItem
            defaultActiveKey={['codes']}
            items={[
                {
                    key: 'codes',
                    label: (
                        <span className="text-base font-semibold">
                            {' '}
                            {messages('common.code')}{' '}
                        </span>
                    ),
                    children: (
                        <div className="grid grid-cols-3 items-center gap-5">
                            <div className="col-span-1">
                                <FormItem
                                    name="upc"
                                    label="UPC/EAN/JAN"
                                    ErrorMessage={errors.upc?.message}
                                    tooltipInfor={messages(
                                        'tooltipForm.eanUpcCode'
                                    )}
                                >
                                    <Controller
                                        control={control}
                                        name="upc"
                                        render={({ field }) => (
                                            <Input
                                                id="upc"
                                                {...field}
                                                value={field.value ?? ''}
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(value);
                                                    debouncedUpdate({
                                                        upc: value,
                                                    });
                                                }}
                                                allowClear
                                                status={
                                                    errors.upc
                                                        ? 'error'
                                                        : undefined
                                                }
                                                disabled={
                                                    isCreateReleasePage ||
                                                    isReadMode
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                            <div className="col-span-1">
                                <FormItem
                                    name="catalogId"
                                    label="ID Catalog"
                                    ErrorMessage={errors.catalogId?.message}
                                    tooltipInfor={messages(
                                        'tooltipForm.catalogId'
                                    )}
                                >
                                    <Controller
                                        control={control}
                                        name="catalogId"
                                        render={({ field }) => (
                                            <Input
                                                id="catalogId"
                                                {...field}
                                                value={field.value ?? ''}
                                                onBlur={(e) => {
                                                    const value =
                                                        e.target.value;
                                                    field.onChange(value);
                                                    debouncedUpdate({
                                                        catalogId: value,
                                                    });
                                                }}
                                                allowClear
                                                status={
                                                    errors.catalogId
                                                        ? 'error'
                                                        : undefined
                                                }
                                                disabled={
                                                    isCreateReleasePage ||
                                                    isReadMode
                                                }
                                            />
                                        )}
                                    />
                                </FormItem>
                            </div>
                        </div>
                    ),
                },
            ]}
        />
    );
}
