import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Form, Input } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
};

export default function CodesSection({ isReadMode, debouncedUpdate }: Props) {
    // hook - state
    const messages = useTranslations();
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    // const { action } = useGetReleaseDetailRoute();

    // router - params
    const params = useParams();
    // const isReadMode = useMemo(
    //     () => action !== RELEASE_DETAIL_ACTION.EDIT,
    //     [action]
    // );
    const isCreateReleasePage = params['action'] === 'create';

    return (
        <div className="flex flex-col gap-4 rounded-lg bg-white p-4">
            <span className="text-base font-semibold">
                {messages('common.code')}
            </span>
            <div className="grid grid-cols-3 items-center gap-4">
                <div className="col-span-1">
                    <Form.Item
                        label="UPC/EAN/JAN"
                        validateStatus={errors.upc ? 'error' : ''}
                        help={errors.upc?.message as string}
                        tooltip={messages('tooltipForm.eanUpcCode')}
                    >
                        <Controller
                            control={control}
                            name="upc"
                            render={({ field: { ref, ...field } }) => (
                                <Input
                                    id="upc"
                                    {...field}
                                    value={field.value ?? ''}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdate({
                                            upc: value,
                                        });
                                    }}
                                    allowClear
                                    status={errors.upc ? 'error' : undefined}
                                    disabled={isCreateReleasePage || isReadMode}
                                />
                            )}
                        />
                    </Form.Item>
                </div>
                <div className="col-span-1">
                    <Form.Item
                        label="ID Catalog"
                        validateStatus={errors.catalogId ? 'error' : ''}
                        help={errors.catalogId?.message as string}
                        tooltip={messages('tooltipForm.catalogId')}
                    >
                        <Controller
                            control={control}
                            name="catalogId"
                            render={({ field: { ref, ...field } }) => (
                                <Input
                                    id="catalogId"
                                    {...field}
                                    value={field.value ?? ''}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdate({
                                            catalogId: value,
                                        });
                                    }}
                                    allowClear
                                    status={
                                        errors.catalogId ? 'error' : undefined
                                    }
                                    disabled={isCreateReleasePage || isReadMode}
                                />
                            )}
                        />
                    </Form.Item>
                </div>
            </div>
        </div>
    );
}
