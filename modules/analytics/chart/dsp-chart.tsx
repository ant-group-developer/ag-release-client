import {
    CartesianGrid,
    Legend,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

export default function DspChart() {
    const dspData = [
        {
            month: 'Jan',
            TikTok: 420,
            Spotify: 2300,
            Amazon: 180,
            YouTubeMusic: 1500,
            Deezer: 640,
        },
        {
            month: 'Feb',
            TikTok: 510,
            Spotify: 2450,
            Amazon: 890,
            YouTubeMusic: 2500,
            Deezer: 580,
        },
        {
            month: 'Mar',
            TikTok: 390,
            Spotify: 2100,
            Amazon: 260,
            YouTubeMusic: 1420,
            Deezer: 700,
        },
        {
            month: 'Apr',
            TikTok: 600,
            Spotify: 2800,
            Amazon: 200,
            YouTubeMusic: 1700,
            Deezer: 750,
        },
        {
            month: 'May',
            TikTok: 550,
            Spotify: 2600,
            Amazon: 3000,
            YouTubeMusic: 1600,
            Deezer: 720,
        },
        {
            month: 'Jun',
            TikTok: 700,
            Spotify: 3000,
            Amazon: 280,
            YouTubeMusic: 1850,
            Deezer: 810,
        },
        {
            month: 'Jul',
            TikTok: 480,
            Spotify: 2700,
            Amazon: 330,
            YouTubeMusic: 1750,
            Deezer: 690,
        },
        {
            month: 'Aug',
            TikTok: 3000,
            Spotify: 3200,
            Amazon: 850,
            YouTubeMusic: 1950,
            Deezer: 770,
        },
    ];

    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="rounded-lg border border-gray-200 bg-white px-4 py-2 shadow-md">
                    <p className="mb-2 font-semibold">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={`item-${index}`}
                            className="m-0 flex items-center gap-2 text-sm"
                        >
                            <span
                                className="h-2.5 w-2.5 rounded-full"
                                style={{ backgroundColor: entry.color }}
                            />
                            <span style={{ color: entry.color }}>
                                {entry.name}:
                            </span>
                            <span className="font-medium">{entry.value}</span>
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    return (
        <div className="h-full px-2 py-4">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart data={dspData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />

                    <Line
                        type="monotone"
                        dataKey="Spotify"
                        stroke="#22C55E"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="YouTubeMusic"
                        stroke="#EF4444"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="TikTok"
                        stroke="#8B5CF6"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="Amazon"
                        stroke="#F59E0B"
                        fill="url(#amazonGradient)"
                        dot={false}
                    />
                    <Line
                        type="monotone"
                        dataKey="Deezer"
                        stroke="#3B82F6"
                        dot={false}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
