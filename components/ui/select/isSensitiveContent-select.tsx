import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import { useGetListTrackSensitive } from '@/modules/track-sensitive/hooks/use-get-list-track-sensitive';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = Omit<SelectProps, 'options'> & {
    fallBack?: string;
};

enum SENSITIVE_CONTENT_CODE {
    EXPLICIT_CONTENT_EDITED = 'EXPLICIT_CONTENT_EDITED',
    NO_ADVICE_AVAILABLE = 'NO_ADVICE_AVAILABLE',
    NOT_EXPLICIT = 'NOT_EXPLICIT_(CLEAN)',
    PARENTAL_ADVISORY = 'PARENTAL_ADVISORY',
}

export const getIntlSensitiveContent = (value: string) => {
    switch (value) {
        case SENSITIVE_CONTENT_CODE.EXPLICIT_CONTENT_EDITED:
            return 'trackSensitive.explicitContentEdited';
        case SENSITIVE_CONTENT_CODE.NOT_EXPLICIT:
            return 'trackSensitive.notExplicit';
        case SENSITIVE_CONTENT_CODE.NO_ADVICE_AVAILABLE:
            return 'trackSensitive.noAdviceAvailable';
        case SENSITIVE_CONTENT_CODE.PARENTAL_ADVISORY:
            return 'trackSensitive.parentalAdvisory';
        default:
            break;
    }
};

export default function SensitiveContentSelect({ fallBack, ...props }: Props) {
    const messages = useTranslations();
    const { trackSensitiveData } = useGetListTrackSensitive({
        pageSize: PAGE_SIZE_EXTRA_LARGE,
    });
    const options = trackSensitiveData?.items?.map((item) => ({
        key: item?.id,
        label: (
            <div className="flex items-center gap-1">
                {messages(getIntlSensitiveContent(item?.code) as any)}
                {item?.icon && (
                    <Image
                        width={18}
                        height={18}
                        alt=""
                        src={item?.icon}
                        className="rounded-md"
                    />
                )}
            </div>
        ),
        value: item?.id,
    }));

    const labelRender = (props: any) => {
        const { label, value } = props;
        if (value) {
            return fallBack || label;
        }
    };

    return (
        <Select
            labelRender={labelRender}
            {...props}
            className="w-full"
            showSearch
            options={options}
        />
    );
}
