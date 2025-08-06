import FormItem from '@/components/ui/react-hook-form/form-item';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useReleaseDetailActionStore } from '@/modules/releases/hooks/use-release-action-store';
import { Input } from 'antd';
import Title from 'antd/lib/typography/Title';
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
    const releaseDetailAction = useReleaseDetailActionStore(
        (state) => state.action
    );

    // router - params
    const params = useParams();
    const isReadMode = useMemo(
        () => releaseDetailAction !== RELEASE_DETAIL_ACTION.EDIT,
        [releaseDetailAction]
    );
    const isCreateReleasePage = params['action'] === 'create';

    return (
        <CollapseItem
            defaultActiveKey={['codes']}
            items={[
                {
                    key: 'codes',
                    label: (
                        <Title level={5} className="!mb-0">
                            {' '}
                            {messages('common.code')}{' '}
                        </Title>
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
                                                onChange={(e) => {
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
                                                onChange={(e) => {
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
