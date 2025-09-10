import AppCard from '@/components/ant-music/app-card';
import {
    Area,
    AreaChart,
    Legend,
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
        <AppCard title={'Revenue'}>
            <div className="h-[300px] px-4">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={dspData}>
                        <XAxis
                            dataKey="month"
                            axisLine={false}
                            tickLine={false}
                        />
                        <YAxis axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Legend verticalAlign="bottom" height={36} />
                        <defs>
                            <linearGradient
                                id="spotifyGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#22C55E"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#22C55E"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="youtubeGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#EF4444"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#EF4444"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="tiktokGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#8B5CF6"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#8B5CF6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="amazonGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#F59E0B"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#F59E0B"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                            <linearGradient
                                id="deezerGradient"
                                x1="0"
                                y1="0"
                                x2="0"
                                y2="1"
                            >
                                <stop
                                    offset="5%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0.3}
                                />
                                <stop
                                    offset="95%"
                                    stopColor="#3B82F6"
                                    stopOpacity={0}
                                />
                            </linearGradient>
                        </defs>

                        <Area
                            type="monotone"
                            dataKey="Spotify"
                            stroke="#22C55E"
                            fill="url(#spotifyGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="YouTubeMusic"
                            stroke="#EF4444"
                            fill="url(#youtubeGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="TikTok"
                            stroke="#8B5CF6"
                            fill="url(#tiktokGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="Amazon"
                            stroke="#F59E0B"
                            fill="url(#amazonGradient)"
                        />
                        <Area
                            type="monotone"
                            dataKey="Deezer"
                            stroke="#3B82F6"
                            fill="url(#deezerGradient)"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </AppCard>
    );
}
