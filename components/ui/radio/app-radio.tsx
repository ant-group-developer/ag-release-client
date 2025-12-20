import { cn } from '@/helpers/common';
import { Radio, RadioProps } from 'antd';
import { createStyles } from 'antd-style';

type Props = RadioProps & {};

export default function AppRadio({ ...props }: Props) {
    const useStyles = createStyles(({ token }) => ({
        radio: {
            border: `1px solid ${token.colorBorder}`,
            borderRadius: token.borderRadius,
            padding: '4px 8px',
            cursor: 'pointer',
            transition: 'all .2s',
            minWidth: '100px',

            '&:hover': {
                borderColor: token.colorPrimaryHover,
            },

            // 👉 KEY POINT: trạng thái checked
            '&.ant-radio-wrapper-checked': {
                borderColor: token.colorPrimary,
                background: token.colorBgContainer,
            },
        },
    }));

    const { styles } = useStyles();
    return <Radio {...props} className={cn(styles.radio, props?.className)} />;
}
