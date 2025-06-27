import AppFormItem from '@/components/ui/antd-form/form-Item';
import ArtistSelect from '@/components/ui/select/artist-select';
import RoleArtistSelect from '@/components/ui/select/role-artist-select';
import { roleArtist } from '@/modules/artist/constants';
import { Button } from 'antd';
import { FormListFieldData } from 'antd/es/form';
import { Form } from 'antd/lib';
import { useTranslations } from 'next-intl';

type Props = {};

export default function DynamicFieldContributor({}: Props) {
    const messages = useTranslations();
    return (
        <div>
            <div className="mb-4 text-sm font-bold">
                Artists and Contributors
            </div>
            <Form.List
                name="contributors"
                initialValue={[{ role: 'Main Artist' }]}
            >
                {(fields: FormListFieldData[], { add, remove }) => (
                    <div className="space-y-6">
                        {fields.map((field, index) => (
                            <div key={field.key} className="flex flex-col">
                                <div className="grid flex-1 grid-cols-2 gap-x-8">
                                    <AppFormItem
                                        {...field}
                                        name={[field.name, 'role']}
                                        label="Role*"
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.select'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <RoleArtistSelect
                                            showSearch
                                            allowClear
                                            disabled={index === 0}
                                            defaultValue={
                                                roleArtist.filter(
                                                    (item) =>
                                                        item.name ===
                                                        'Main Artist'
                                                )[0].name
                                            }
                                        />
                                    </AppFormItem>
                                    <AppFormItem
                                        {...field}
                                        name={[field.name, 'artist']}
                                        label="Name*"
                                        required
                                        rules={[
                                            {
                                                required: true,
                                                message:
                                                    messages(
                                                        'validation.select'
                                                    ),
                                            },
                                        ]}
                                    >
                                        <ArtistSelect showSearch allowClear />
                                    </AppFormItem>
                                </div>
                                <div className="flex justify-end gap-2">
                                    <Button
                                        danger
                                        onClick={() => remove(field.name)}
                                        className="min-w-[100px]"
                                        disabled={index === 0}
                                    >
                                        Remove
                                    </Button>
                                    <Button
                                        type="primary"
                                        onClick={() => add()}
                                        className="min-w-[100px]"
                                    >
                                        New
                                    </Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </Form.List>
        </div>
    );
}
