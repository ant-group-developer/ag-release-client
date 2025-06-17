import ImageListUpload from '@/components/ui/input/image-list-upload';
import { cn } from '@/helpers/tailwind';
import { useReleaseFormStore } from '@/modules/releases/hooks/releaseFormStore';
import { useTranslations } from 'next-intl';
import { Controller, useForm } from 'react-hook-form';

type Props = {
    isScrolled: boolean;
};

export default function ReleaseDetailHeader({ isScrolled }: Props) {
    const messages = useTranslations();
    const { control, handleSubmit, setValue } = useForm();
    const formValues = useReleaseFormStore((state) => state.formValues);
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const mainArtist = formValues?.artists?.find(
        (artist: any) => artist.role === 'Main Artist'
    );

    const handleValuesChange = (data: any) => {
        setFormValues({ ...formValues, ...data });
    };

    return (
        <div>
            <form onSubmit={handleSubmit(handleValuesChange)}>
                <div className="flex justify-between px-4 py-2">
                    <div className="flex w-full gap-4">
                        <div>
                            <Controller
                                name="thumbnail"
                                control={control}
                                rules={{
                                    required: {
                                        value: true,
                                        message: messages('validation.image'),
                                    },
                                }}
                                render={({ field }) => (
                                    <ImageListUpload
                                        className={cn(
                                            'release-detail-header-upload size-28 !rounded-lg !border-0 !p-0 transition-all duration-300',
                                            {
                                                'size-12 transition-all duration-300':
                                                    isScrolled,
                                            }
                                        )}
                                        accept="image/*"
                                        maxCount={1}
                                        placeholder="Tải ảnh lên"
                                        {...field}
                                    />
                                )}
                            />
                        </div>
                        <div className="">
                            <div
                                className={cn('grid grid-cols-2 gap-2', {
                                    'grid-cols-3': isScrolled,
                                })}
                            >
                                <div className="text-sm">
                                    <span>Tên phát hành: </span>
                                    <span className="font-bold">
                                        {formValues.nameRelease}{' '}
                                        {formValues.version &&
                                            formValues.nameRelease &&
                                            `[${formValues.version}]`}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Label: </span>
                                    <span className="font-bold">
                                        {formValues.label}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Nghệ sĩ: </span>
                                    <span className="font-bold">
                                        {formValues?.artists
                                            ? mainArtist?.name
                                            : ''}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Thể loại: </span>
                                    <span className="font-bold">
                                        {formValues.genres}
                                    </span>
                                </div>
                                <div className="text-sm">
                                    <span>Ngôn ngữ: </span>
                                    <span className="font-bold">
                                        {formValues.metaDataLanguage}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}
