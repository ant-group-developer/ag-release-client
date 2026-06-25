'use client';

import { Spin } from 'antd';

export default function NewsLoading() {
    return (
        <div className="flex justify-center py-24">
            <Spin size="large" />
        </div>
    );
}
