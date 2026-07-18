import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import MetadataInfoItem from '../metadata-info/metadata-info-item';

type Props = {};

export default function ReviewInfor({}: Props) {
    const messages = useTranslations();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const { token } = theme.useToken();

    return (
        <div>
            <div className="grid grid-cols-4 gap-4">
                <MetadataInfoItem
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    className="!border-none"
                    label={messages('release.releaseDate')}
                >
                    <p className="pt-1">
                        {formValues.releaseDate ??
                            messages('common.notAvailable')}
                    </p>
                </MetadataInfoItem>

                <MetadataInfoItem
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    className="!border-none"
                    label={messages('release.releaseOriginalDate')}
                >
                    <p className="pt-1">
                        {formValues.releaseOriginalDate ??
                            messages('common.notAvailable')}
                    </p>
                </MetadataInfoItem>

                <MetadataInfoItem
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    className="!border-none"
                    label={messages('release.releaseTime')}
                >
                    <p className="pt-1">
                        {formValues.releaseTime ??
                            messages('common.notAvailable')}
                    </p>
                </MetadataInfoItem>

                <MetadataInfoItem
                    style={{
                        backgroundColor: token.colorBgContainer,
                    }}
                    className="!border-none"
                    label={messages('timezone.label')}
                >
                    <p className="pt-1">
                        {formValues?.timeZone?.name ??
                            messages('common.notAvailable')}
                    </p>
                </MetadataInfoItem>
            </div>
        </div>
    );
}
