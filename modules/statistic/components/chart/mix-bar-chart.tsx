import {
    Bar,
    BarChart,
    CartesianGrid,
    Legend,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

const data = [
    {
        date: '01/04/2025',
        new: 0,
        inProgress: 0,
        pendingApproval: 2,
        reject: 0,
        completed: 85,
        cancel: 0,
        overdue: 10,
    },
    {
        date: '02/04/2025',
        new: 0,
        inProgress: 0,
        pendingApproval: 2,
        reject: 0,
        completed: 116,
        cancel: 0,
        overdue: 10,
    },
    {
        date: '03/04/2025',
        new: 0,
        inProgress: 1,
        pendingApproval: 1,
        reject: 2,
        completed: 76,
        cancel: 0,
        overdue: 10,
    },
];

export default function CustomMixBarChart() {
    return (
        <ResponsiveContainer width={'100%'} height={300}>
            <BarChart
                data={data}
                margin={{
                    top: 20,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="new" stackId="a" fill="#1E90FF" />
                <Bar dataKey="inProgress" stackId="a" fill="#FFD700" />
                <Bar dataKey="pendingApproval" stackId="a" fill="#9C27B0" />
                <Bar dataKey="reject" stackId="a" fill="#9E9E9E" />
                <Bar dataKey="completed" stackId="a" fill="#4CAF50" />
                <Bar dataKey="cancel" stackId="a" fill="#FFA500" />
                <Bar dataKey="overdue" fill="#FF6347" />
            </BarChart>
        </ResponsiveContainer>
    );
}
