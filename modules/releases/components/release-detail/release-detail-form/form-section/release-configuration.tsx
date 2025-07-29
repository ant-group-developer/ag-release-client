import FormItem from '@/components/ui/react-hook-form/form-item';
import LabelSelect from '@/components/ui/select/label-select';
import { getReleaseDetailTabRoute } from '@/helpers/link';
import { useRouter } from '@/i18n/routing';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { RELEASES_TABS, RELEASES_TYPE } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { CreateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { CreateVariables } from '@/types/api';
import { Button, Input, Radio } from 'antd';
import Title from 'antd/lib/typography/Title';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';
import { ReleaseDetailSchema } from '..';

type Props = {
    setShowCreateLabel: (show: boolean) => void;
    debouncedUpdate: (data: any, fieldName?: string) => void;
};

export default function ReleaseConfigurationSection({
    setShowCreateLabel,
    debouncedUpdate,
}: Props) {
    // hook - state
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const { createReleaseDraft, isPending: isOnCreatingDraft } =
        useCreateReleaseDraft();
    const messages = useTranslations();

    // router
    const params = useParams();
    const router = useRouter();

    // variables
    const isCreateReleasePage = params['action'] === 'create';
    const version = watch('version') ?? '';
    const type = watch('type');
    const title = watch('title') ?? '';
    const isEnableCreateDraftBtn = (!!type && !!title) === true;

    // funtion
    const handleCreateReleaseDraft = () => {
        const variables: CreateVariables<CreateReleaseDraftPayload> = {
            payload: {
                title: title ?? '',
                version: version ?? '',
                type: type ?? RELEASES_TYPE.ALBUM,
            },
            onSuccess: (data) => {
                router.push(
                    getReleaseDetailTabRoute(
                        data?.id,
                        RELEASES_TABS.CORE_DETAIL
                    )
                );
            },
        };
        createReleaseDraft(variables);
    };

    return (
        <CollapseItem
            defaultActiveKey={['release-configuration']}
            items={[
                {
                    key: 'release-configuration',
                    label: (
                        <Title level={4} className="!mb-0">
                            {messages('releases.configuration')}
                        </Title>
                    ),
                    children: (
                        <div>
                            <div className="grid grid-cols-3 items-center gap-5">
                                <div className="col-span-3">
                                    <FormItem
                                        name="title"
                                        label={messages('releases.name')}
                                        required
                                        ErrorMessage={errors?.title?.message}
                                        tooltipInfor={messages(
                                            'tooltipForm.releaseTitle'
                                        )}
                                    >
                                        <Controller
                                            control={control}
                                            name="title"
                                            render={({ field }) => (
                                                <div>
                                                    <Input
                                                        id="title"
                                                        {...field}
                                                        value={
                                                            field.value ?? ''
                                                        }
                                                        onChange={(e) => {
                                                            const value =
                                                                e.target.value;
                                                            field.onChange(
                                                                value
                                                            );
                                                            debouncedUpdate(
                                                                {
                                                                    title: value,
                                                                },
                                                                'title'
                                                            );
                                                        }}
                                                        allowClear
                                                        disabled={
                                                            isOnCreatingDraft
                                                        }
                                                        status={
                                                            errors.title
                                                                ? 'error'
                                                                : undefined
                                                        }
                                                    />
                                                </div>
                                            )}
                                        />
                                    </FormItem>
                                </div>
                                <div className="col-span-1">
                                    <FormItem
                                        name="version"
                                        label={messages('releases.version')}
                                        ErrorMessage={errors.version?.message}
                                        tooltipInfor={messages(
                                            'tooltipForm.version'
                                        )}
                                    >
                                        <Controller
                                            control={control}
                                            name="version"
                                            render={({ field }) => (
                                                <Input
                                                    id="version"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate(
                                                            { version: value },
                                                            'version'
                                                        );
                                                    }}
                                                    allowClear
                                                    disabled={isOnCreatingDraft}
                                                    status={
                                                        errors.version
                                                            ? 'error'
                                                            : undefined
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                                <div className="col-span-1">
                                    <FormItem
                                        name="labelId"
                                        label="Label"
                                        required
                                        ErrorMessage={errors.labelId?.message}
                                        tooltipInfor={messages(
                                            'tooltipForm.label'
                                        )}
                                    >
                                        <Controller
                                            control={control}
                                            name="labelId"
                                            render={({ field }) => (
                                                <LabelSelect
                                                    className="w-full"
                                                    showSearch
                                                    allowClear
                                                    id="labelId"
                                                    {...field}
                                                    onCreateLabel={() =>
                                                        setShowCreateLabel(true)
                                                    }
                                                    onChange={(e) => {
                                                        field.onChange(e);
                                                        debouncedUpdate({
                                                            labelId: e,
                                                        });
                                                    }}
                                                    status={
                                                        errors.labelId
                                                            ? 'error'
                                                            : undefined
                                                    }
                                                    disabled={
                                                        isCreateReleasePage
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                                <div className="col-span-1">
                                    <FormItem
                                        name="type"
                                        label={messages('releases.type')}
                                        required
                                        ErrorMessage={errors.type?.message}
                                        tooltipInfor={messages(
                                            'tooltipForm.releaseType'
                                        )}
                                    >
                                        <Controller
                                            control={control}
                                            name="type"
                                            render={({ field }) => (
                                                <Radio.Group
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate({
                                                            type: value,
                                                        });
                                                    }}
                                                    disabled={isOnCreatingDraft}
                                                >
                                                    {Object.values(
                                                        RELEASES_TYPE
                                                    ).map((type) => (
                                                        <Radio
                                                            key={type}
                                                            value={type}
                                                            className="capitalize"
                                                        >
                                                            {type}
                                                        </Radio>
                                                    ))}
                                                </Radio.Group>
                                            )}
                                        />
                                    </FormItem>
                                </div>
                            </div>
                            {isCreateReleasePage && (
                                <div className="col-span-3 flex w-full justify-end">
                                    <Button
                                        type="primary"
                                        onClick={() =>
                                            handleCreateReleaseDraft()
                                        }
                                        disabled={!isEnableCreateDraftBtn}
                                        loading={isOnCreatingDraft}
                                    >
                                        {messages('common.continue')}
                                    </Button>
                                </div>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
