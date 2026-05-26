import AppFormItem from '@/components/ui/antd-form/form-Item';
import { Col, Input, Row, Select } from 'antd';
import { useTranslations } from 'next-intl';

export default function AdditionalTab() {
    const messages = useTranslations();

    return (
        <div className="mx-auto w-full pb-8 pt-4">
            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem name="upc" label="UPC">
                        <Input placeholder="UPC" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="audioIsrc" label="Audio ISRC">
                        <Input placeholder="Audio ISRC" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="videoVersion" label="Video version">
                        <Select
                            placeholder="Select..."
                            allowClear
                            options={[
                                {
                                    value: 'official',
                                    label: 'Official Video',
                                },
                                {
                                    value: 'lyrics',
                                    label: 'Lyrics Video',
                                },
                                { value: 'teaser', label: 'Teaser' },
                                {
                                    value: 'live',
                                    label: 'Live Performance',
                                },
                            ]}
                        />
                    </AppFormItem>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem
                        name="partnerCustomId1"
                        label="Partner custom ID 1"
                    >
                        <Input placeholder="Partner custom ID 1" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem
                        name="partnerCustomId2"
                        label="Partner custom ID 2"
                    >
                        <Input placeholder="Partner custom ID 2" allowClear />
                    </AppFormItem>
                </Col>
            </Row>

            <div className="mb-4 mt-6 border-b border-gray-100 pb-2 text-base font-bold text-gray-800">
                Credits
            </div>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem name="composers" label="Composer(s)">
                        <Input placeholder="Composer(s)" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="editors" label="Editor(s)">
                        <Input placeholder="Editor(s)" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="producers" label="Producer(s)">
                        <Input placeholder="Producer(s)" allowClear />
                    </AppFormItem>
                </Col>
            </Row>

            <Row gutter={16}>
                <Col span={8}>
                    <AppFormItem name="directors" label="Director(s)">
                        <Input placeholder="Director(s)" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="copyright" label="Copyright">
                        <Input placeholder="Copyright" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="copyrightYear" label="Copyright year">
                        <Input placeholder="Copyright year" allowClear />
                    </AppFormItem>
                </Col>
            </Row>
        </div>
    );
}
