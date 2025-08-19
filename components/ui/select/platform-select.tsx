import { PAGE_SIZE_EXTRA_LARGE } from '@/constants/page-size';
import useModalStore from '@/hooks/use-modal';
import { useGetListDsp } from '@/modules/dsp/hooks/use-get-list-dsp';
import { DspData } from '@/modules/dsp/types';
import { Select, SelectProps } from 'antd';
import { useTranslations } from 'next-intl';
import Image from 'next/image';

type Props = SelectProps;

export default function PlatformSelect({ mode, ...props }: Props) {
    const messages = useTranslations();
    const openModal = useModalStore((state) => state.openModal);

    const { dspData } = useGetListDsp({ pageSize: PAGE_SIZE_EXTRA_LARGE });

    const isMultipleMode = mode === 'multiple';

    const options: SelectProps['options'] = [
        ...(isMultipleMode
            ? [
                  {
                      label: messages('common.all'),
                      options: [
                          {
                              value: 'ALL',
                              label: messages('common.all'),
                              id: 0,
                          },
                      ],
                  },
              ]
            : []),
        {
            label: messages('common.platforms'),
            options: dspData.items.map((dsp: DspData) => ({
                value: dsp.id,
                label: (
                    <div className="flex items-center gap-2">
                        {dsp?.picture && (
                            <Image
                                width={16}
                                height={16}
                                src={dsp.picture}
                                alt=""
                                className="rounded-full"
                            />
                        )}
                        <span>{dsp.name}</span>{' '}
                    </div>
                ),
                id: dsp.id,
            })),
        },
    ];

    const handleChange = (value: any) => {
        if (isMultipleMode && Array.isArray(value)) {
            if (value.includes('ALL')) {
                const allPlatformIds = dspData.items.map((p) => p.id);
                props.onChange?.(allPlatformIds);
            } else {
                props.onChange?.(value);
            }
        } else {
            props.onChange?.(value);
        }
    };

    return (
        <Select
            {...props}
            mode={mode}
            options={options}
            onChange={handleChange}
        />
    );
}
