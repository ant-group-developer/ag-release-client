import { Button, Image } from 'antd';

type Props = {};

export default function ArtistDetailHeader({}: Props) {
    return (
        <div className="flex items-center justify-between pb-4">
            <div className="flex items-center gap-4">
                <div className="h-[160px] overflow-hidden rounded-full">
                    <Image
                        src="https://cdn.revelator.com/images/fd0359c6-3cb8-426c-bcdf-db7e113627b7/file_w160.jpg?_=5/30/2025"
                        alt="artist"
                        width={160}
                        height={160}
                        className="object-contain"
                    />
                </div>
                <div className="flex flex-1 flex-col gap-2">
                    <h1 className="text-4xl font-bold">Ant Remix</h1>
                    <Button shape="round" className="w-24">
                        See info
                    </Button>
                </div>
            </div>
            <div>
                <Button shape="round">Chỉnh sửa</Button>
            </div>
        </div>
    );
}
