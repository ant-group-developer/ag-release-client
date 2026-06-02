import { useGetDetailRelease } from '@/modules/releases/hooks/use-get-detail-release';
import { Col, FormInstance, Row } from 'antd';
import { useParams } from 'next/navigation';
import MetadataFields from './metadata-fields';
import VideoAssets from './video-assets';

interface DetailsTabProps {
    form: FormInstance;
}

export default function DetailsTab({ form }: DetailsTabProps) {
    const params = useParams();
    const id = params?.id as string;
    const { releaseData: dataEdit } = useGetDetailRelease(id);

    return (
        <div className="mx-auto w-full pb-8 pt-4">
            <Row gutter={32}>
                {/* Left Side: VEVO Video Assets Management Column */}
                <Col
                    span={8}
                    className="flex flex-col gap-6 border-r border-gray-100 pr-6"
                >
                    <VideoAssets form={form} dataEdit={dataEdit} />
                </Col>

                {/* Right Side: Metadata Fields Layout */}
                <Col span={16}>
                    <MetadataFields dataEdit={dataEdit} />
                </Col>
            </Row>
        </div>
    );
}
