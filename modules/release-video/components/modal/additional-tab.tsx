import AppFormItem from '@/components/ui/antd-form/form-Item';
import { Col, Input, Row, DatePicker } from 'antd';
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
                    <AppFormItem name="version" label="Video version">
                        <Input placeholder="Video version" allowClear />
                    </AppFormItem>
                </Col>

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
                    <AppFormItem name="cLineOwner" label="Copyright">
                        <Input placeholder="Copyright" allowClear />
                    </AppFormItem>
                </Col>
                <Col span={8}>
                    <AppFormItem name="cLineYear" label="Copyright year">
                        <DatePicker
                            picker="year"
                            placeholder="Copyright year"
                            className="w-full"
                            allowClear
                        />
                    </AppFormItem>
                </Col>
            </Row>
        </div>
    );
}
