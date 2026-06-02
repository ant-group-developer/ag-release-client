import AppFormItem from '@/components/ui/antd-form/form-Item';
import {
    Button,
    Card,
    Col,
    DatePicker,
    Divider,
    Form,
    FormInstance,
    FormListFieldData,
    Input,
    Row,
    Select,
    Space,
    Typography,
} from 'antd';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface PolicyItemProps {
    field: FormListFieldData;
    index: number;
    form: FormInstance;
    remove: (name: number) => void;
    countriesData: any[];
}

export default function PolicyItem({
    field,
    index,
    form,
    remove,
    countriesData,
}: PolicyItemProps) {
    const [pasteText, setPasteText] = useState('');

    const currentPolicies = form.getFieldValue('territoryPolicies') || [];
    const policyType = currentPolicies[index]?.policyType || 'Monetized';

    // Handle selecting all countries (worldwide)
    const handleWorldwide = () => {
        const allCountryIds = countriesData.map((c) => c.id);
        const currentPolicies = form.getFieldValue('territoryPolicies') || [];
        const updatedPolicies = [...currentPolicies];

        if (updatedPolicies[index]) {
            updatedPolicies[index] = {
                ...updatedPolicies[index],
                countries: allCountryIds,
            };
            form.setFieldsValue({ territoryPolicies: updatedPolicies });
        }
    };

    // Handle parsing pasted ISO2 codes
    const handleAddPastedCodes = () => {
        if (!pasteText.trim()) return;

        const codes = pasteText
            .split(',')
            .map((c) => c.trim().toUpperCase())
            .filter(Boolean);

        const matchedIds: string[] = [];
        codes.forEach((code) => {
            const country = countriesData.find(
                (c) => c.iso2?.toUpperCase() === code
            );
            if (country) {
                matchedIds.push(country.id);
            }
        });

        if (matchedIds.length === 0) return;

        const currentPolicies = form.getFieldValue('territoryPolicies') || [];
        const currentPolicy = currentPolicies[index] || {};
        const currentCountries = currentPolicy.countries || [];

        const newCountriesList = Array.from(
            new Set([...currentCountries, ...matchedIds])
        );

        const updatedPolicies = [...currentPolicies];
        updatedPolicies[index] = {
            ...currentPolicy,
            countries: newCountriesList,
        };

        form.setFieldsValue({ territoryPolicies: updatedPolicies });
        setPasteText('');
    };

    const countryOptions = countriesData.map((country) => {
        return {
            value: country.id,
            label: (
                <Space size={8} align="center">
                    <span style={{ fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase', color: '#8c8c8c' }}>
                        {country.iso2}
                    </span>
                    <span style={{ fontSize: '12px' }}>{country.name}</span>
                </Space>
            ),
            title: country.name,
            searchText: `${country.iso2} ${country.name}`,
        };
    });

    return (
        <Card
            title={
                <Typography.Text strong style={{ fontSize: '14px' }}>
                    Territory policy - {policyType}
                </Typography.Text>
            }
            extra={
                <Button
                    type="text"
                    danger
                    onClick={() => remove(field.name)}
                    icon={<Trash2 className="h-4 w-4" />}
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                />
            }
            style={{
                borderRadius: '12px',
                border: '1px solid #f0f0f0',
                boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.03)',
            }}
        >
            {/* Date Range Inputs */}
            <Row gutter={16}>
                <Col span={12}>
                    <AppFormItem
                        name={[field.name, 'startTime']}
                        label="Start time"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select a date"
                            format="YYYY-MM-DD"
                        />
                    </AppFormItem>
                </Col>
                <Col span={12}>
                    <AppFormItem
                        name={[field.name, 'endTime']}
                        label="End time"
                    >
                        <DatePicker
                            style={{ width: '100%' }}
                            placeholder="Select a date"
                            format="YYYY-MM-DD"
                        />
                    </AppFormItem>
                </Col>
            </Row>

            <Divider style={{ margin: '16px 0 12px 0' }} />

            {/* Available Section */}
            <div>
                <Typography.Text
                    strong
                    style={{
                        display: 'block',
                        marginBottom: '8px',
                        fontSize: '12px',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                    }}
                >
                    Available
                </Typography.Text>

                {/* Comma-separated paste input */}
                <div style={{ marginBottom: '16px' }}>
                    <Typography.Text
                        type="secondary"
                        style={{
                            display: 'block',
                            marginBottom: '4px',
                            fontSize: '11px',
                        }}
                    >
                        To add more countries, paste a comma separated list of ISO2 country codes.
                    </Typography.Text>
                    <Space.Compact style={{ width: '100%' }}>
                        <Input
                            placeholder="e.g. VN, US, GB, JP"
                            value={pasteText}
                            onChange={(e) => setPasteText(e.target.value)}
                            onPressEnter={handleAddPastedCodes}
                        />
                        <Button onClick={handleAddPastedCodes} type="primary">
                            Add
                        </Button>
                    </Space.Compact>
                </div>

                {/* Action options row */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '8px',
                    }}
                >
                    <Button
                        type="link"
                        onClick={handleWorldwide}
                        style={{
                            padding: 0,
                            height: 'auto',
                            fontSize: '12px',
                            fontWeight: 'bold',
                        }}
                    >
                        {policyType === 'Monetized'
                            ? 'Monetize worldwide'
                            : 'Block worldwide'}
                    </Button>
                </div>

                {/* Country Selector Multi-select */}
                <Form.Item name={[field.name, 'countries']} noStyle>
                    <Select
                        allowClear
                        mode="multiple"
                        style={{ width: '100%' }}
                        placeholder="Select..."
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                            (option?.searchText || '')
                                .toLowerCase()
                                .includes(input.toLowerCase())
                        }
                        options={countryOptions}
                    />
                </Form.Item>
            </div>
        </Card>
    );
}

