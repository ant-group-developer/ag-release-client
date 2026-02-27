import FormItem from '@/components/ui/react-hook-form/form-item';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { useGenerateUpc } from '@/modules/releases/hooks/use-generate-upc';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { BarcodeOutlined } from '@ant-design/icons';
import { Input } from 'antd';
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
    const { generateUpc } = useGenerateUpc();

    // router - params
    const params = useParams();
    // const isReadMode = useMemo(
    //     () => action !== RELEASE_DETAIL_ACTION.EDIT,
    //     [action]
    // );
    const isCreateReleasePage = params['action'] === 'create';

    const handleGenerateUPC = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        generateUpc({
            releaseId: params['release-id'] as string,
            onSuccess: (data) => {
                console.log('🚀 ~ handleGenerateUPC ~ data:', data);
            },
            onError: () => {},
        });
    };

    return (
        <CollapseItem
            defaultActiveKey={['codes']}
            items={[
                {
                    key: 'codes',
                    label: (
                        <span className="text-base font-semibold">
                            {messages('common.code')}
                        </span>
                    ),
                    children: (
                        <div className="grid grid-cols-3 items-center gap-4">
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
                                        render={({
                                            field: { ref, ...field },
                                        }) => (
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
                                                suffix={
                                                    !(
                                                        isCreateReleasePage ||
                                                        isReadMode
                                                    ) &&
                                                    !field.value && (
                                                        <span
                                                            onClick={
                                                                handleGenerateUPC
                                                            }
                                                        >
                                                            <BarcodeOutlined className="mr-1" />
                                                            <span className="cursor-pointer hover:underline">
                                                                {messages(
                                                                    'common.generate'
                                                                )}
                                                            </span>
                                                        </span>
                                                    )
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
                                        render={({
                                            field: { ref, ...field },
                                        }) => (
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
