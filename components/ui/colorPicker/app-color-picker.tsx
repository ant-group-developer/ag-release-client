import { genPreset } from '@/helpers/common';
import {
    blue,
    cyan,
    gold,
    green,
    grey,
    magenta,
    purple,
    red,
    volcano,
} from '@ant-design/colors';
import { ColorPicker, ColorPickerProps } from 'antd';

type AppColorPickerProps = ColorPickerProps & {};

export default function AppColorPicker({ ...props }: AppColorPickerProps) {
    const defaultPresets = {
        purple,
        green,
        magenta,
        blue,
        volcano,
        red,
        cyan,
        gold,
        grey,
    };

    const presetColors = genPreset(defaultPresets);

    return (
        <ColorPicker
            presets={presetColors}
            format="hex"
            showText
            placement="right"
            {...props}
        />
    );
}
