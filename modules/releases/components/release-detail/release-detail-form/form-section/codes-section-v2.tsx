import AppFormItem from '@/components/ui/antd-form/form-Item';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { Input } from 'antd';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    debouncedUpdate: (data: any) => void;
    isReadMode: boolean;
    isCreateReleasePage: boolean;
};

export default function CodesSectionV2({
    debouncedUpdate,
    isReadMode,
    isCreateReleasePage,
}: Props) {
    const {
        control,
        formState: { errors },
    } = useFormContext<ReleaseDetailSchema>();
    const messages = useTranslations();

    return (
        <div id="codes" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('release.upcCatalogCode')}
            </span>
            <div className="grid grid-cols-1 gap-x-16 gap-y-1 md:grid-cols-2 lg:grid-cols-2">
                <AppFormItem
                    label="UPC/EAN/JAN"
                    validateStatus={errors.upc ? 'error' : ''}
                    help={errors.upc?.message as string}
                    tooltip={messages('tooltipForm.eanUpcCode')}
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
                                    const value = e.target.value.trim();
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
                </AppFormItem>
                <AppFormItem
                    label="ID Catalog"
                    validateStatus={errors.catalogId ? 'error' : ''}
                    help={errors.catalogId?.message as string}
                    tooltip={messages('tooltipForm.catalogId')}
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
                                    const value = e.target.value.trim();
                                    field.onChange(value);
                                    debouncedUpdate({
                                        catalogId: value,
                                    });
                                }}
                                allowClear
                                status={errors.catalogId ? 'error' : undefined}
                                disabled={isCreateReleasePage || isReadMode}
                            />
                        )}
                    />
                </AppFormItem>
            </div>
        </div>
    );
}
