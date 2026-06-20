import { convertSecondsToHHMMSS, formattedDate } from '@/helpers/common';
import { theme } from 'antd';
import { useTranslations } from 'next-intl';
import React from 'react';
import { ImportJobStatusResponse } from '../../types/payload';

interface ImportJobMetadataProps {
    jobStatus: ImportJobStatusResponse;
}

export const ImportJobMetadata: React.FC<ImportJobMetadataProps> = ({
    jobStatus,
}) => {
    const messages = useTranslations();
    const { token } = theme.useToken();

    return (
        <div
            className="mt-auto flex flex-col gap-3 pt-3 text-xs"
            style={{
                color: token.colorTextDescription,
                borderTop: `1px solid ${token.colorBorderSecondary}`,
            }}
        >
            {/* <div className="flex flex-col gap-1 w-full">
                <span className="font-semibold">
                    {messages('reportConfigs.importResult.sourceFile')}:
                </span>
                <div className="flex flex-col gap-0.5 max-h-[100px] overflow-y-auto">
                    {(jobStatus.file
                        ? jobStatus.file
                              .split(',')
                              .map((f: string) => f.trim())
                              .filter(Boolean)
                        : []
                    ).map((file: string, idx: number) => (
                        <span key={idx} className="break-all">
                            {file}
                        </span>
                    ))}
                </div>
            </div> */}

            <div className="flex flex-wrap justify-between gap-4">
                {jobStatus.startedAt ? (
                    <div>
                        <span className="mr-1 font-semibold">
                            {messages('common.startedAt')}:
                        </span>
                        <span>{formattedDate(jobStatus.startedAt)}</span>
                    </div>
                ) : (
                    <div />
                )}
                {jobStatus.durationMs > 0 && (
                    <div>
                        <span className="mr-1 font-semibold">
                            {messages('reportConfigs.importResult.duration')}:
                        </span>
                        <span>
                            {convertSecondsToHHMMSS(
                                jobStatus.durationMs / 1000
                            )}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
