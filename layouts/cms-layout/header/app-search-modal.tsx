import AppSearch from '@/components/ui/input/search';
import AppModal, { AppModalProps } from '@/components/ui/modal/normal-modal';
import CustomTooltip from '@/components/ui/tooltip/custom-tooltip';
import useModalStore from '@/hooks/use-modal';
import { Skeleton } from 'antd';
import { Settings } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useQueryState } from 'nuqs';

type Props = AppModalProps & {};

export default function AppSearchModal({ ...props }: Props) {
    const messages = useTranslations();
    const closeModal = useModalStore((state) => state.closeModal);
    const [keyword, setKeyword] = useQueryState('keyword', {
        defaultValue: '',
    });

    return (
        <AppModal
            onCancel={closeModal}
            open
            title={messages('common.search')}
            width={800}
            {...props}
        >
            <AppSearch
                className="w-full"
                defaultValue={keyword}
                onChange={(e) => setKeyword(e.target.value)}
            />
            <div className="py-6 text-gray-500">
                {keyword.length === 0 && (
                    <>
                        <p className="pb-2 dark:text-white">
                            {messages('action.quickActions').toUpperCase()}{' '}
                        </p>
                        <div className="grid cursor-pointer grid-cols-4 gap-2">
                            {Array.from({ length: 4 }).map((_, index) => (
                                <div
                                    key={index}
                                    className="card-item-search bg-card-bg hover:bg-card-bg-hover dark:bg-card-bg-dark dark:hover:bg-card-bg-hover-dark flex h-32 flex-col justify-between rounded-lg p-4 hover:text-black dark:hover:text-white"
                                >
                                    <Settings />
                                    <CustomTooltip
                                        title={messages('setting.quickSetting')}
                                    >
                                        <p className="truncate text-base dark:text-white">
                                            {messages('setting.quickSetting')}
                                        </p>
                                    </CustomTooltip>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {keyword.length > 0 && <Skeleton />}
            </div>
        </AppModal>
    );
}
