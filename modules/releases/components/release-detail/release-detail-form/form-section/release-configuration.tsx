import AppRadio from '@/components/ui/radio/app-radio';
import FormItem from '@/components/ui/react-hook-form/form-item';
import LabelSelect from '@/components/ui/select/label-select';
import { RELEASE_DETAIL_ACTION } from '@/helpers/link';
import { useGetReleaseDetailRoute } from '@/hooks/use-get-release-detail-route';
import { useReleaseActionStore } from '@/hooks/use-release-action-store';
import { useRouter } from '@/i18n/routing';
import { useGetListSimpleReleaseTypes } from '@/modules/release-types/hooks/use-get-list-simple-release-types';
import { ReleaseTypesData } from '@/modules/release-types/types';
import { CollapseItem } from '@/modules/releases/components/collapse/collapse-item';
import { RELEASES_TABS } from '@/modules/releases/enums';
import { useCreateReleaseDraft } from '@/modules/releases/hooks/use-create-release-draft';
import { ReleaseDetailSchema } from '@/modules/releases/schemas';
import { CreateReleaseDraftPayload } from '@/modules/releases/types/payload';
import { CreateVariables } from '@/types/api';
import { Button, Input, Radio } from 'antd';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import { Controller, useFormContext } from 'react-hook-form';

type Props = {
    debouncedUpdate: (data: any, fieldName?: string) => void;
    isReadMode: boolean;
};

export default function ReleaseConfigurationSection({
    debouncedUpdate,
    isReadMode,
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
    const { getReleaseTabRoute } = useGetReleaseDetailRoute();
    const releaseAction = useReleaseActionStore((state) => state.action);
    // const { token } = theme.useToken();

    // router and params
    const params = useParams();
    const router = useRouter();

    // apis
    const { releaseTypesData } = useGetListSimpleReleaseTypes();

    // variables
    const isCreateReleasePage = params['action'] === 'create';
    const version = watch('version') ?? '';
    const albumFormatId = watch('albumFormatId') ?? '';
    const title = watch('title') ?? '';
    const labelId = watch('labelId') ?? '';
    const isEnableCreateDraftBtn =
        (!!albumFormatId && !!title && !!labelId) === true;
    // const isReadMode = useMemo(
    //     () =>
    //         releaseAction !== RELEASE_DETAIL_ACTION.EDIT &&
    //         !isCreateReleasePage,
    //     [releaseAction, isCreateReleasePage]
    // );

    // funtion
    const handleCreateReleaseDraft = () => {
        const variables: CreateVariables<CreateReleaseDraftPayload> = {
            payload: {
                title,
                version,
                albumFormatId,
                labelId,
            },
            onSuccess: (data) => {
                router.push(
                    getReleaseTabRoute(
                        data?.id,
                        RELEASES_TABS.CORE_DETAIL,
                        RELEASE_DETAIL_ACTION.EDIT
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
                        <span className="text-base font-semibold">
                            {messages('release.configuration')}
                        </span>
                    ),
                    children: (
                        <div>
                            <div className="grid grid-cols-3 items-center gap-5">
                                <div className="col-span-3">
                                    <FormItem
                                        name="title"
                                        label={messages('release.name')}
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
                                                <Input
                                                    id="title"
                                                    {...field}
                                                    value={field.value ?? ''}
                                                    onBlur={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate(
                                                            {
                                                                title: value,
                                                            },
                                                            'title'
                                                        );
                                                    }}
                                                    allowClear
                                                    disabled={
                                                        isOnCreatingDraft ||
                                                        isReadMode
                                                    }
                                                    status={
                                                        errors.title
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
                                        name="version"
                                        label={messages('release.version')}
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
                                                    onBlur={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate(
                                                            { version: value },
                                                            'version'
                                                        );
                                                    }}
                                                    allowClear
                                                    disabled={
                                                        isOnCreatingDraft ||
                                                        isReadMode
                                                    }
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
                                                    id="labelId"
                                                    {...field}
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
                                                        isOnCreatingDraft ||
                                                        isReadMode
                                                    }
                                                />
                                            )}
                                        />
                                    </FormItem>
                                </div>
                                <div className="col-span-1">
                                    <FormItem
                                        name="albumFormatId"
                                        label={messages('release.type')}
                                        required
                                        ErrorMessage={
                                            errors.albumFormatId?.message
                                        }
                                        tooltipInfor={messages(
                                            'tooltipForm.releaseType'
                                        )}
                                    >
                                        <Controller
                                            control={control}
                                            name="albumFormatId"
                                            render={({ field }) => (
                                                <Radio.Group
                                                    {...field}
                                                    onChange={(e) => {
                                                        const value =
                                                            e.target.value;
                                                        field.onChange(value);
                                                        debouncedUpdate({
                                                            albumFormatId:
                                                                value,
                                                        });
                                                    }}
                                                    disabled={
                                                        isOnCreatingDraft ||
                                                        isReadMode
                                                    }
                                                >
                                                    {releaseTypesData?.map(
                                                        (
                                                            type: ReleaseTypesData
                                                        ) => (
                                                            <AppRadio
                                                                key={type.id}
                                                                value={type.id}
                                                            >
                                                                {type?.name}
                                                            </AppRadio>
                                                        )
                                                    )}
                                                </Radio.Group>
                                            )}
                                        />
                                    </FormItem>
                                </div>
                            </div>
                            {isCreateReleasePage && (
                                <>
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
                                    <div className="flex justify-end py-2 text-sm italic text-zinc-500">
                                        *
                                        {messages(
                                            'release.placeholder.enterTitleAndReleaseType'
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    ),
                },
            ]}
        />
    );
}
