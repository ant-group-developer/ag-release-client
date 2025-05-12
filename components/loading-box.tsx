import { Spin } from 'antd';

type Props = React.HTMLAttributes<HTMLDivElement> & {};

export default function LoadingBox({ ...props }: Props) {
    return (
        <div {...props}>
            <Spin className="flex-1" />
        </div>
    );
}
