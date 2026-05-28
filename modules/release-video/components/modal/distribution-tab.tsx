import AppFormItem from '@/components/ui/antd-form/form-Item';
import { useGetListSimpleCountries } from '@/modules/countries/hooks/use-get-list-simple-countries';
import {
    Alert,
    Button,
    Divider,
    Dropdown,
    Form,
    FormInstance,
    Select,
    Space,
    Tooltip,
    Typography,
} from 'antd';
import { ChevronDown, Globe } from 'lucide-react';
import PolicyItem from './policy-item';

interface DistributionTabProps {
    form: FormInstance;
}

export default function DistributionTab({ form }: DistributionTabProps) {
    const { countriesData = [] } = useGetListSimpleCountries();

    // Add policy dropdown menu items
    const policyMenuItems = [
        {
            key: 'Monetized',
            label: 'Territory policy - Monetized',
        },
        {
            key: 'Blocked',
            label: 'Territory policy - Blocked',
        },
    ];

    return (
        <div style={{ maxWidth: '100%', padding: '16px 0 32px 0' }}>
            {/* Visibility Section */}
            <AppFormItem
                name="visibility"
                label="Visibility"
                initialValue="Default"
                tooltipInfo="Configure video access scope and standard visibility settings."
            >
                <Select
                    style={{ width: '100%', maxWidth: '448px' }}
                    placeholder="Select visibility..."
                    defaultValue="Default"
                    options={[
                        { value: 'Default', label: 'Default' },
                        {
                            value: 'Unlisted on YouTube',
                            label: 'Unlisted on YouTube',
                        },
                        {
                            value: 'Unlisted on Vevo',
                            label: 'Unlisted on Vevo',
                        },
                        {
                            value: 'Unlisted on YouTube/Vevo',
                            label: 'Unlisted on YouTube/Vevo',
                        },
                    ]}
                />
            </AppFormItem>

            {/* Form list for dynamic policies */}
            <Form.List name="territoryPolicies">
                {(fields, { add, remove }) => {
                    const handleAddPolicy = (type: string) => {
                        add({
                            policyType: type,
                            startTime: null,
                            endTime: null,
                            displayFullNames: false,
                            countries: [],
                        });
                    };

                    return (
                        <div>
                            <Divider style={{ margin: '32px 0 24px 0' }} />

                            <div
                                style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '16px',
                                }}
                            >
                                <Space size={8} align="center">
                                    <Typography.Text
                                        strong
                                        style={{
                                            fontSize: '14px',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.05em',
                                        }}
                                    >
                                        Territory policies
                                    </Typography.Text>
                                    <Typography.Text type="secondary">
                                        |
                                    </Typography.Text>
                                    <Typography.Link
                                        style={{
                                            fontSize: '12px',
                                            fontWeight: 600,
                                        }}
                                    >
                                        View territory list
                                    </Typography.Link>
                                    <Typography.Text type="secondary">
                                        |
                                    </Typography.Text>
                                    <Tooltip title="Define custom policies per country, set monetization active dates, or block territories.">
                                        <Typography.Link
                                            style={{
                                                fontSize: '12px',
                                                fontWeight: 600,
                                            }}
                                        >
                                            Learn more
                                        </Typography.Link>
                                    </Tooltip>
                                </Space>

                                <Dropdown
                                    menu={{
                                        items: policyMenuItems,
                                        onClick: ({ key }) =>
                                            handleAddPolicy(key),
                                    }}
                                    trigger={['click']}
                                >
                                    <Button
                                        shape="round"
                                        style={{ fontWeight: '500' }}
                                    >
                                        <Space size={6}>
                                            Add policy
                                            <ChevronDown
                                                style={{
                                                    width: 12,
                                                    height: 12,
                                                }}
                                            />
                                        </Space>
                                    </Button>
                                </Dropdown>
                            </div>

                            {/* Alert Callout Box */}
                            <Alert
                                type="info"
                                showIcon
                                message={
                                    <div
                                        style={{
                                            fontSize: '12px',
                                            lineHeight: '1.6',
                                        }}
                                    >
                                        <p>
                                            A video can have more than one
                                            territory policy depending on
                                            monetization, start, and end dates
                                            in various territories. All
                                            territories are blocked by default
                                            unless explicitly added.
                                        </p>
                                        <p>
                                            Note: Adding all territories is not
                                            truly worldwide. If you would like
                                            to apply a worldwide policy you must
                                            select it from the drop down list.
                                        </p>
                                    </div>
                                }
                                style={{ marginBottom: '24px' }}
                            />

                            {/* Render added policy blocks */}
                            {fields.length === 0 ? (
                                <div
                                    style={{
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '40px 24px',
                                        border: '1px dashed #d9d9d9',
                                        borderRadius: '8px',
                                    }}
                                >
                                    <Globe
                                        style={{
                                            width: 36,
                                            height: 36,
                                            color: '#bfbfbf',
                                            marginBottom: 8,
                                        }}
                                    />
                                    <Typography.Text
                                        type="secondary"
                                        style={{ fontSize: '13px' }}
                                    >
                                        No policies added yet. Click &quot;Add
                                        policy&quot; to configure territory
                                        availability.
                                    </Typography.Text>
                                </div>
                            ) : (
                                <Space
                                    direction="vertical"
                                    size={24}
                                    style={{ width: '100%' }}
                                >
                                    {fields.map((field, index) => (
                                        <PolicyItem
                                            key={field.key}
                                            field={field}
                                            index={index}
                                            form={form}
                                            remove={remove}
                                            countriesData={countriesData}
                                        />
                                    ))}
                                </Space>
                            )}
                        </div>
                    );
                }}
            </Form.List>
        </div>
    );
}
