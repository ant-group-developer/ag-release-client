'use client';

import AppContainer from '@/components/ant-music/app-container';
import { Button, Image } from 'antd';

type Props = {};

export default function Overview({}: Props) {
    return (
        <AppContainer>
            <div className="flex items-center justify-between">
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
                    <Button shape="round" size="large">
                        Chỉnh sửa
                    </Button>
                </div>
            </div>
        </AppContainer>
    );
}
