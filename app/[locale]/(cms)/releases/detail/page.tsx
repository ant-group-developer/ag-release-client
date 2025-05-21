'use client';

import { useRouter } from '@/i18n/routing';
import ReleaseDetailForm from '@/modules/release-detail/release-detail-form';
import { Button, Form } from 'antd';

export default function CoreDetail() {
    const router = useRouter();
    const [form] = Form.useForm();

    const fakeIdRelease = 'id-123-456-789';

    const handleSubmit = async () => {
        try {
            router.push(`/releases/detail/${fakeIdRelease}/core-detail`);
        } catch (error) {
            console.error('Lỗi khi xác thực form:', error);
        }
    };

    return (
        <div>
            <ReleaseDetailForm form={form} />

            <div className="flex justify-end p-4">
                <Button type="primary" onClick={handleSubmit}>
                    Lưu thông tin
                </Button>
            </div>
        </div>
    );
}
