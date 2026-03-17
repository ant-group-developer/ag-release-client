import AppFormItem from '@/components/ui/antd-form/form-Item';
import LabelSelect from '@/components/ui/select/label-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import { ReleaseTypesData } from '@/modules/release-types/types';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { CreateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { CreateVariables } from '@/types/api';
import { Button, Input, Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
    isCreateReleasePage: boolean;
};

export default function ReleaseConfigurationSectionV2({
    debouncedUpdate,
    isReadMode,
    isCreateReleasePage,
}: Props) {
    const {
        control,
        formState: { errors },
        watch,
    } = useFormContext<ReleaseDetailSchema>();
    const { createReleaseDraft, isPending: isOnCreatingDraft } =
        useCreateReleaseDraft();
    const messages = useTranslations();
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const setReleaseAction = useReleaseActionStore((state) => state.setAction);
    const router = useRouter();

    const { releaseTypesData } = useGetListSimpleReleaseTypes();

    const version = watch('version') ?? '';
    const albumFormatId = watch('albumFormatId') ?? '';
    const title = watch('title') ?? '';
    const labelId = watch('labelId') ?? '';
    const isEnableCreateDraftBtn =
        (!!albumFormatId && !!title && !!labelId) === true;

    const handleCreateReleaseDraft = () => {
        const variables: CreateVariables<CreateReleaseDraftPayload> = {
            payload: {
                title,
                version,
                albumFormatId,
                labelId,
            },
            onSuccess: (data) => {
                setReleaseAction(RELEASE_DETAIL_ACTION.EDIT);
                router.push(
                    getReleaseTabRoute(data?.id, RELEASES_TABS.CORE_DETAIL)
                );
            },
        };
        createReleaseDraft(variables);
    };

    return (
        <div id="release-configuration" className="flex flex-col gap-6">
            <span className="text-base font-semibold">
                {messages('release.configuration')}
            </span>
            <div className="grid grid-cols-1 gap-x-16 gap-y-1 md:grid-cols-2 lg:grid-cols-2">
                <div className="col-span-1">
                    <AppFormItem
                        label={messages('release.name')}
                        required
                        validateStatus={errors.title ? 'error' : ''}
                        help={errors.title?.message as string}
                        tooltip={messages('tooltipForm.releaseTitle')}
                    >
                        <Controller
                            control={control}
                            name="title"
                            render={({ field }) => (
                                <Input
                                    id="title"
                                    {...field}
                                    value={field.value ?? ''}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdate(
                                            { title: value },
                                            'title'
                                        );
                                    }}
                                    allowClear
                                    disabled={
                                        isOnCreatingDraft ||
                                        (!isCreateReleasePage && isReadMode)
                                    }
                                />
                            )}
                        />
                    </AppFormItem>
                </div>
                <div className="col-span-1">
                    <AppFormItem
                        label={messages('release.version')}
                        validateStatus={errors.version ? 'error' : ''}
                        help={errors.version?.message as string}
                        tooltip={messages('tooltipForm.version')}
                    >
                        <Controller
                            control={control}
                            name="version"
                            render={({ field }) => (
                                <Input
                                    id="version"
                                    {...field}
                                    value={field.value ?? ''}
                                    onBlur={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdate(
                                            { version: value },
                                            'version'
                                        );
                                    }}
                                    allowClear
                                    disabled={
                                        isOnCreatingDraft ||
                                        (!isCreateReleasePage && isReadMode)
                                    }
                                    status={
                                        errors.version ? 'error' : undefined
                                    }
                                />
                            )}
                        />
                    </AppFormItem>
                </div>
                <div className="col-span-1">
                    <AppFormItem
                        label="Label"
                        required
                        validateStatus={errors.labelId ? 'error' : ''}
                        help={errors.labelId?.message as string}
                        tooltip={messages('tooltipForm.label')}
                    >
                        <Controller
                            control={control}
                            name="labelId"
                            render={({ field }) => (
                                <LabelSelect
                                    className="w-full"
                                    showSearch
                                    id="labelId"
                                    {...field}
                                    onChange={(e) => {
                                        field.onChange(e);
                                        debouncedUpdate({
                                            labelId: e,
                                        });
                                    }}
                                    status={
                                        errors.labelId ? 'error' : undefined
                                    }
                                    disabled={
                                        isOnCreatingDraft ||
                                        (!isCreateReleasePage && isReadMode)
                                    }
                                />
                            )}
                        />
                    </AppFormItem>
                </div>
                <div className="col-span-1">
                    <AppFormItem
                        label={messages('release.type')}
                        required
                        validateStatus={errors.albumFormatId ? 'error' : ''}
                        help={errors.albumFormatId?.message as string}
                        tooltip={messages('tooltipForm.releaseType')}
                    >
                        <Controller
                            control={control}
                            name="albumFormatId"
                            render={({ field }) => (
                                <Radio.Group
                                    {...field}
                                    onChange={(e) => {
                                        const value = e.target.value;
                                        field.onChange(value);
                                        debouncedUpdate({
                                            albumFormatId: value,
                                        });
                                    }}
                                    disabled={
                                        isOnCreatingDraft ||
                                        (!isCreateReleasePage && isReadMode)
                                    }
                                >
                                    {releaseTypesData?.map(
                                        (type: ReleaseTypesData) => (
                                            <Radio
                                                key={type.id}
                                                value={type.id}
                                            >
                                                {type?.name}
                                            </Radio>
                                        )
                                    )}
                                </Radio.Group>
                            )}
                        />
                    </AppFormItem>
                </div>
            </div>
            {isCreateReleasePage && (
                <div className="flex flex-col items-end gap-2">
                    <Button
                        type="primary"
                        onClick={handleCreateReleaseDraft}
                        disabled={!isEnableCreateDraftBtn}
                        loading={isOnCreatingDraft}
                    >
                        {messages('common.continue')}
                    </Button>
                    <div className="text-sm italic text-zinc-500">
                        *
                        {messages(
                            'release.placeholder.enterTitleAndReleaseType'
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
