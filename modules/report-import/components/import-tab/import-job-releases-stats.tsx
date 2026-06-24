import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ImportJobResultReleases } from '../../types/payload';

interface ImportJobReleasesStatsProps {
    releases: ImportJobResultReleases;
}

export const ImportJobReleasesStats: React.FC<ImportJobReleasesStatsProps> = ({
    releases,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div className="mt-2">
            <div
                className="mb-2 text-[13px] font-semibold"
                style={{
                    color: token.colorText,
                }}
            >
                {messages('reportConfigs.importResult.releaseStats')}
            </div>
            <div
                className="grid grid-cols-3 gap-3 p-3"
                style={{
                    backgroundColor: token.colorBgLayout,
                    borderRadius: token.borderRadius,
                }}
            >
                <div>
                    <div
                        className="text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.releaseTotal')}
                    </div>
                    <div
                        className="text-base font-semibold"
                        style={{
                            color: token.colorText,
                        }}
                    >
                        {releases.total.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        className="text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.releaseImported')}
                    </div>
                    <div
                        className="text-base font-semibold"
                        style={{
                            color: token.colorSuccess,
                        }}
                    >
                        {releases.imported.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        className="text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.releaseSkipped')}
                    </div>
                    <div
                        className="text-base font-semibold"
                        style={{
                            color: token.colorWarning,
                        }}
                    >
                        {releases.skipped.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        className="text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.releaseErrors')}
                    </div>
                    <div
                        className="text-base font-semibold"
                        style={{
                            color: token.colorError,
                        }}
                    >
                        {releases.errors.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        className="text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.releaseInDb')}
                    </div>
                    <div
                        className="text-base font-semibold"
                        style={{
                            color: token.colorPrimary,
                        }}
                    >
                        {releases.inDb.toLocaleString()}
                    </div>
                </div>
                <div>
                    <div
                        className="text-xs"
                        style={{
                            color: token.colorTextDescription,
                        }}
                    >
                        {messages('reportConfigs.importResult.releasePending')}
                    </div>
                    <div
                        className="text-base font-semibold"
                        style={{
                            color: token.colorTextSecondary,
                        }}
                    >
                        {releases.pending.toLocaleString()}
                    </div>
                </div>
            </div>
        </div>
    );
};
