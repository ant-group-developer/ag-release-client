import { TreeSelect, TreeSelectProps } from 'antd';
import { useTranslations } from 'next-intl';

type Props = TreeSelectProps & {};

export default function RegionSelect({ ...props }: Props) {
    const messages = useTranslations();

    const treeData = [
        {
            title: messages('common.all'), // ALL là node cha
            value: 'ALL',
            key: 'ALL',
            children: [
                {
                    title: 'Asia',
                    value: 'asia',
                    key: 'asia',
                    children: [
                        { title: 'China', value: 'china', key: 'china' },
                        { title: 'India', value: 'india', key: 'india' },
                        { title: 'Japan', value: 'japan', key: 'japan' },
                    ],
                },
                {
                    title: 'Europe',
                    value: 'europe',
                    key: 'europe',
                    children: [
                        { title: 'Germany', value: 'germany', key: 'germany' },
                        { title: 'France', value: 'france', key: 'france' },
                        { title: 'United Kingdom', value: 'uk', key: 'uk' },
                    ],
                },
                {
                    title: 'Africa',
                    value: 'africa',
                    key: 'africa',
                    children: [
                        { title: 'Nigeria', value: 'nigeria', key: 'nigeria' },
                        {
                            title: 'South Africa',
                            value: 'south_africa',
                            key: 'south_africa',
                        },
                        { title: 'Egypt', value: 'egypt', key: 'egypt' },
                    ],
                },
                {
                    title: 'North America',
                    value: 'north_america',
                    key: 'north_america',
                    children: [
                        { title: 'United States', value: 'usa', key: 'usa' },
                        { title: 'Canada', value: 'canada', key: 'canada' },
                        { title: 'Mexico', value: 'mexico', key: 'mexico' },
                    ],
                },
                {
                    title: 'South America',
                    value: 'south_america',
                    key: 'south_america',
                    children: [
                        { title: 'Brazil', value: 'brazil', key: 'brazil' },
                        {
                            title: 'Argentina',
                            value: 'argentina',
                            key: 'argentina',
                        },
                        { title: 'Chile', value: 'chile', key: 'chile' },
                    ],
                },
            ],
        },
    ];

    return (
        <TreeSelect
            placeholder={messages('placeholder.selectRegion')}
            {...props}
            treeCheckable
            treeData={treeData}
            showCheckedStrategy={TreeSelect.SHOW_PARENT}
            allowClear
        />
    );
}
