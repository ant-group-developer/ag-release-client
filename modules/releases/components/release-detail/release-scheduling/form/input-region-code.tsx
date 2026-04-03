import { useGetListSimpleCountries } from '@/modules/countries/hooks/use-get-list-simple-countries';
import { useReleaseFormStore } from '@/modules/releases/hooks/release-form-store';
import { useUpdateReleaseDraft } from '@/modules/releases/hooks/use-update-release-draft';
import { ReleasesData } from '@/modules/releases/types';
import { Input, InputProps } from 'antd';
import { debounce } from 'lodash';
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

type Props = InputProps & {
    value?: string[]; // mảng id từ backend
};

export default function InputRegionCode({
    value: externalValue,
    ...props
}: Props) {
    const params = useParams();
    const releaseId = params['release-id'] as string;
    const { countriesData: listRegionCode } = useGetListSimpleCountries();
    // countriesData là mảng { id: string, iso2: string, ... }
    const setFormValues = useReleaseFormStore((state) => state.setFormValues);

    const { updateReleaseDraft } = useUpdateReleaseDraft();

    const [inputValue, setInputValue] = useState('');

    // Khi nhận value từ backend (mảng id) → map sang iso2 → hiển thị
    useEffect(() => {
        if (!listRegionCode?.length) return;

        if (!externalValue || externalValue.length === 0) {
            setInputValue('');
            return;
        }

        const iso2String = externalValue
            .map((id) => listRegionCode.find((c) => c.id === id)?.iso2)
            .filter(Boolean)
            .join(', ');

        setInputValue(iso2String);
    }, [externalValue, listRegionCode]);

    const debouncedUpdate = useCallback(
        debounce((raw: string) => {
            const trimmed = (raw || '').trim();

            if (trimmed === '') {
                updateReleaseDraft({
                    id: releaseId,
                    payload: {
                        releaseTerritory: {
                            selectedCountries: [],
                        },
                    },
                    onSuccess(data: ReleasesData) {
                        setFormValues(data);
                    },
                });
                return;
            }

            // Tách theo dấu phẩy, trim khoảng trắng, bỏ giá trị rỗng
            const codes = trimmed
                .split(',')
                .map((s) => s.trim().toLowerCase())
                .filter(Boolean);

            // Map iso2 → id, bỏ những code không tìm thấy trong list
            const selectedIds = codes
                .map(
                    (code) =>
                        listRegionCode?.find(
                            (c) => c.iso2?.toLowerCase() === code
                        )?.id
                )
                .filter(Boolean) as string[];

            if (!selectedIds.length) return;

            updateReleaseDraft({
                id: releaseId,
                payload: {
                    releaseTerritory: {
                        selectedCountries: selectedIds,
                    },
                },
                onSuccess(data: ReleasesData) {
                    setFormValues(data);
                },
            });
        }, 500),
        [releaseId, listRegionCode, setFormValues, updateReleaseDraft]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const raw = e.target.value;
        setInputValue(raw);
        debouncedUpdate(raw);
    };

    return (
        <Input
            {...props}
            value={inputValue}
            onChange={handleChange}
            placeholder="VI, US, UK, ..."
            allowClear
        />
    );
}
