import { ORDER } from '@/enums/common';
import TopTable from './top-table';

type Props = {};

export default function ListTop() {
    return (
        <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            <div className="rounded-lg border">
                <TopTable
                    titleHeader="Top releases"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 1, name: 'Item 1', total: 100 },
                        { id: 2, name: 'Item 2', total: 200 },
                        { id: 3, name: 'Item 3', total: 300 },
                        { id: 4, name: 'Item 4', total: 400 },
                        { id: 5, name: 'Item 5', total: 500 },
                        { id: 6, name: 'Item 6', total: 600 },
                        { id: 7, name: 'Item 7', total: 700 },
                        { id: 8, name: 'Item 8', total: 800 },
                        { id: 9, name: 'Item 9', total: 900 },
                        { id: 10, name: 'Item 10', total: 1000 },
                    ]}
                />
                {/* <AppPagination
                    current={1}
                    pageSize={10}
                    total={3}
                    align="center"
                    showTotalText
                /> */}
            </div>
            <div className="rounded-lg border">
                <TopTable
                    titleHeader="Top tracks"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 1, name: 'Item 1', total: 100 },
                        { id: 2, name: 'Item 2', total: 200 },
                        { id: 3, name: 'Item 3', total: 300 },
                        { id: 4, name: 'Item 4', total: 400 },
                        { id: 5, name: 'Item 5', total: 500 },
                        { id: 6, name: 'Item 6', total: 600 },
                        { id: 7, name: 'Item 7', total: 700 },
                        { id: 8, name: 'Item 8', total: 800 },
                        { id: 9, name: 'Item 9', total: 900 },
                        { id: 10, name: 'Item 10', total: 1000 },
                    ]}
                />
                {/* <AppPagination
                    current={1}
                    pageSize={10}
                    total={3}
                    align="center"
                    showTotalText
                /> */}
            </div>
            <div className="rounded-lg border">
                <TopTable
                    titleHeader="Top artists"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 1, name: 'Item 1', total: 100 },
                        { id: 2, name: 'Item 2', total: 200 },
                        { id: 3, name: 'Item 3', total: 300 },
                        { id: 4, name: 'Item 4', total: 400 },
                        { id: 5, name: 'Item 5', total: 500 },
                        { id: 6, name: 'Item 6', total: 600 },
                        { id: 7, name: 'Item 7', total: 700 },
                        { id: 8, name: 'Item 8', total: 800 },
                        { id: 9, name: 'Item 9', total: 900 },
                        { id: 10, name: 'Item 10', total: 1000 },
                    ]}
                />
                {/* <AppPagination
                    current={1}
                    pageSize={10}
                    total={3}
                    align="center"
                    showTotalText
                /> */}
            </div>
            <div className="rounded-lg border">
                <TopTable
                    titleHeader="Top labels"
                    dataFilter={{}}
                    orderByField={undefined}
                    orderField={ORDER.ASC}
                    pagination={{ pageSize: 10, current: 1 }}
                    dataSource={[
                        { id: 1, name: 'Item 1', total: 100 },
                        { id: 2, name: 'Item 2', total: 200 },
                        { id: 3, name: 'Item 3', total: 300 },
                        { id: 4, name: 'Item 4', total: 400 },
                        { id: 5, name: 'Item 5', total: 500 },
                        { id: 6, name: 'Item 6', total: 600 },
                        { id: 7, name: 'Item 7', total: 700 },
                        { id: 8, name: 'Item 8', total: 800 },
                        { id: 9, name: 'Item 9', total: 900 },
                        { id: 10, name: 'Item 10', total: 1000 },
                    ]}
                />
            </div>
        </div>
    );
}
