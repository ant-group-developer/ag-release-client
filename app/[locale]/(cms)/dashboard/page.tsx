'use client';

import { useRouter } from '@/i18n/routing';
import DashboardHeader from '@/modules/dashboard/components/header';
import LineChart from '@/modules/dashboard/components/line-chart/line-chart';
import ListNews from '@/modules/dashboard/components/list-news';
import ListRelease from '@/modules/dashboard/components/list-release';
import ListReport from '@/modules/dashboard/components/list-report/list-report';
import CardStatistic from '@/modules/dashboard/components/list-statistic';
import {
    fakeDspData,
    fakeReleasesData,
} from '@/modules/dashboard/constants/mockData';
import { fakeTrackData } from '@/modules/tracks/constants/mockdata';

type Props = {};

function Dashboard({}: Props) {
    const router = useRouter();
    const regionData = [
        {
            id: 1,
            name: 'Việt Nam',
            value: 100,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAARMAAAC3CAMAAAAGjUrGAAAAilBMVEXaJR3//wDZEh7qmRXYAB7ZHR3ZGh3//QDbJhz99AP87gXZEB7++QHbKhzoiBXmfRb0yA3ldhfzww7iYxnwtRDurBH54QjhXhnjbhjdPBvxuQ/eRhvcNRzpkxT42grpjhX20gzjaRjgVRrspBTfTRr76QflehfuqhH43Qn21Av1zAzwtw/rnRPhYBkDKDW4AAAED0lEQVR4nO3d6VbqMBQFYBJOwlAUEZmEgkwq6H3/17tAKXRIoAyu0pP9/RVd7bE7bdMTWioBAAAAAAAAAAAAAAAAAAAAAAAAwNFT3hvweOiV8t6ER6MGYqDy3ogHI8uiLPPeiAdDXfGN8MSokRBihPBESX9TEx/hiaLxpiZjhCeqKraqeW/GI5GTXU0mCM8RrXY1WSE8R0F0EJ4I+byvyTPCE6KPfU0+EJ6QEiFcte3J5qEmTYQnQOtDTdYIT4DEEWqyo5uRmjR13pvzEOglUpMXHChbUkRhkN3QrVhNWgjPdnI6VhNMVW94lVhNKl7eG5Q/3RdxfYQnER2EZ4MqiZpUnK+JnoqkqevhofdUTd5dP1CokapJzfGaqHaqJEK03Z5F8d4MNXlz+xKFaoaauB0eNTOURIiZy+ExRsfx8Bij43Z4LNHhGR4lM6GOpSYdyvYHClQ61ZqXs/DrlprU/Uy/P28VqCj6x7Kz9/VTqDsjmiZvd++vMi3YUCxLqz8uyapavOls8v+0JD4VaCw5oIVtCL1dfVGw3ISUYXLkPl69Ih4kAfr8k5J8FvQgCchR9+4V6Y4KfjukaH7nknwVcnCNo156evF6jV6hcxPSen1+XzNa60Jdup5Az+f3NpMJi4Mk4A2Xd6jIcljwwTVOkXlG7RI/DAbXOOrfdldY6TPKTUhWxzeUZPxUvDu+DBSVry7JL7vchGhmnpM+pzZjmJuQ9pLdJlm8SC4XJWbUPF+DhCbjgyTgDS67K+wOWF2UmCnrEwyTDtvBNY7aWYfaWtGmoa+X6uuzcajfT2eODu8TToTOPiP56UpRYgsxTnNmmYaXuSRCOHAi3kosxDjNkWUamc86W46ceVLd5Ke40WmeWohxmhPLNC58YOpEp7mhm/yUhgM1MSzEOM2BZRoX9xo4EJ4Lo+NCeFTPejzYftDjPoNi6SYXtQUtLLMq7DvNLd3kr54uKcsENvdOc0t09tPQlgls5uHxTHOxx8Yjz9jW1OEdHjK0QkYbjxR9pT9QZx0ew0KMRju+x/QvfbLmuEzjwEsdBR8qeZmqVaqt6YtzeFLR8U2xoIlD4VHDxL5aGo+8YaJ2Q77h8eJ9oe/WZ3zJDuw53/BQrKutdSoRFJu0XbINTyw632caj2T124XweL+RNJx9Nq4o8vFfruGhw0VqtsajSFtTl2l41CDcw6yNR1oenhgyfSGADFv8nrP/0w8d2ExfCLCPzvKixiNvsGQcnt3X+gvxdmHjUdjWxPKFALuv9b+mGzpYl8vyhQC0ud4Yq2v2TOqVYPk2jW10ytc27G3X5TIMjyw3blj/SosGwzOP9vUt/2i1+f27bcvDuHWXGJYEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAmf/IgiyXNAAkFQAAAABJRU5ErkJggg==',
            plays: 3221,
        },
        {
            id: 2,
            name: 'United States',
            value: 130,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAABIFBMVEW/CzD///8AJ2i8ABW+ACPYgI7rxsrx0di/Cy/ZjZb79fbCEje8ABy9CDHdnKXQX3HAACr77vG+ACfCLEUAHmVabZHf398AJ2ypEDLf5+wAKGcADV4AKGUAI2YAAFn//v8AAF4AHWgAImgAFF/LcX/f5uUAC10AAGMAGmDVrrLYuL8AIWEACWIAGGQAAFIUMXGEk60AKmPMfIXd19gaOnWVpLpkc4+vusgvR3xOZpMePXJ5i6pkeqMAGWoaN3YuR3Nmg5zDzNdEWH/n7fPT2OClACcAHm+4xNVxfqC/dYTc5vI5VorCyc8AK16eqb6vvNLCi5dabJmcpsNNV4QfP29ndqEAAEHVucyGl7UAAEyPm6mnK0l9jqPI1eQAEFVOYoeU6CinAAAJcUlEQVR4nO2dbXfaOBaAkaez28lmdrsdE9WyZYxcCK1xgCmOXShhwG5hm5TMNNPdbjcd/v+/WL8HiLFCmJZa6PmQkxjjHj/n+kq6ktyS8MWBTx6WCg1XRGXTG8ZcEY0ugogrykFpWqdVBLmiNSAfWbJ1BaLlQMoPq31ShDEmDjhQMYKbxBHTipZTc6fXQqIFwEsMYW9RAcS5xlhWhB3iP0IE4Sj5GDbwqVSCn30xPKOKgoDqvCJ7qghipzbAfoZ2zpTwQLN8AEKkoRyd8ssbU1AGUr+6p4oQUoEnNlu2p8cPUqMr+WEERqYYHdAtYMGBBMb7GkUCVCXg+cnng5HkmhM3CKKJmrRof1SA6x86E1bbuGVFpR+LTN6D9k69CIzU5NiQ4rdnwJPAQTVRpn8MTnDVRkfIydivHxSaHEWNN7Mw80z1pONjfgKWNpiAeZJ7SKcSPHnutImVtdcR//V9kXm6VhFU+lFuBm+7JD42mMybUFD7VgOFZ+Dq26CNCwKpLK5VJLugyNTWKsLn9sXb6CS3FXWQEHwXho//WAUoRIlOkOzrsrP+QZOlHd7g9hytU4SQMairqh8js1Gt5iSOop+RDmRcenbbfxjH6kDMKQCwpwimQy4ITyRgHdebZpJogkH+TbigRlMe6C5o+b8qMJSX1a6xp8g3lFqQ7QOTMq6vTkE1bfEzY4k9RUgw0lgwrbZJqw7JkyqMogx1h1lJmyVFUZKBZN5PvGCnJdAqaLCT/Ia7bw0sdFbPZ0kRFIjp/6y67UHuk7MO3APesaFr3RazigSx3+81VRu0zc3qijGkWwFWr+19Xn7cWFKkCC1/gOG34u1jQcgbUWQBFaPeii76bjn2WFIEO+JVeNQr1zVxwyK+oV7N3LCnXTaXP2FKkQLltn+XwX16rzabDcK/f44vOVJX5BZcUW1FUTR09+9zerZhFJHB2I4qbuOVlr/669+LzA+LikgHO2EQHZ1pItnMkJ/IRM0JFbna8ifw9YMHh8VlqRiCkCaB2nsALo47Qk6NLBuIDF9R+dw6sOXlD56UHj0sMEuKxKl9rqpTMKpvqCeCDMFMJbp6vtwvYqkwCxGSRUE5tr37KRKc2nEH3uousKQoeNT8UYhStVaa7bvScwLNCtOKYnLnfHLAmR0FJhX9uXBFmSyGEzuKFETQpgOzNSDSW3DEjCIEey8JZRnMXVHIaKFrxIwigYzdEwihsNHCmNtg//uyBdSFQ0923fnbjlQRNH4DU10xGo28yWcqZ11Vls8AgEY698jMhDXU28DVW1dW39gijCAZuRNrAsBL1UzSEXny6OGjAhMpgqLc1Gx/BFoBbid/QVU+iBi1cCwrzabDOPkPXvyzyLyIFOH+qBaXR+D6mec7QVAyP+2WozgqeL0oLqnhXrTCAVScTauNtzA/hFfyfqvHk01sKBKgjN6HB8riVg2an+m1sPzoqQaOHzRGFAmC2AsXMUpaZ+3930URrJYBGLlAqt9M6bKiiIwB+FD2wPS+Y9gI2Hg7ctRexTXS/jU7ivxuUV3Urt43tlIk9Jy6qIhd0E2PMKOoem0FPWLc2DJdRwWRxtxh70GDv2/3hK1QvVnYx4yiP2mQnwE7ir4YXNE+KtpmoA9RtNYPISW9SsEVZayYxdsUjBAKl60vbS4yn/+lyDxbUETCHlG129qi9gh7fQ0LyOzMbyqz6PV3h98Vl8OFktq0rxJBLnvyhhs7l9DcyUBUX4Fwn1Z85Se7rqxuSXpzpAdGLa0NZvo2yUi2gTScAEmFC1VHRmrXCm5egMrIH+sb5P6KUCMqhVj6TSgyo0hAZB7enYrvG0XBovbBMLzIYtmJGUUIytEqPhvfdySCBKydRjXHkVhdyEWMKBLUfrQpCLjze656EOA7O+1N3KxSZ0aReRneWgW4Nenl/SZBEBn3+23Lv8bFhffZSZp9VhTh8+vTueOCyr9V1W/77xdECjEbDdUDM1Wr62nHiBVFAq6KRrMNRsdIgPfsXyvB96A+A+dECRY/sqYouBfUAu375qEU40paXuTGkiIkyJdjsn6T691A5sq2faYUwc5ZUlrbYgxCjOW/8etdD7O24nBlpJ/mWIVs/C6ndRlM/M9fi8zztXtju1OyiR9xerpuplsvdr0oa1djMLqCsrWywDwX6A9fPTV4wVFGJBW8pJa1fThcXyS7UnODooiiSmBoilXTuP0Ze4pQq+X3HssAIFPMXiW8ChZ1rQXApDc//ejc/gaDitAESCN/NGpP506P3MHQ8Nqyveh6M30foggS+TL9vHyHugh2JsnplprxOXuKFEU4iVcb2QsljfUg3DyPguhazcpe7CkKNlrj8MMrlSQZG3Yybh4meQeR/4ZvD+lnbupnUJEgNKzww/M09XazFmZBY5ieMACgBoCbkYkYVaS6wD71gyJZR4Ov7HDDa9o5DN+iotrT5AC5AlKrNQGnWQVLFhU1rmtDTXcOJklQ4BawNNJs9s9iI32hbmptkL60yPzkNTDR5lZWGLGoCDv1qoJEeJn2r5t+SI1tMIlfGWZMwag8BWCeKBJfBRU0+KaRla51Jl/xBJVgx0zanOGT8ORKMk8L1VF4wNHT80M3q5v14pj730+FJm9lSNicQcWQxXZY979OJ8dItHbUK+t6NL7P6xvAYq/ef0hfPIPP42mNA5HETT9UVC+aLTmY9TCt68RSSS37BnH/Ms63nhqXhBQt7lt61hhTX3/NvKJgf0hdiHKPHb/rwvR7BH4Odrt1nVC/vweKAup+1AynM+9j2O/Bw8+f5o0ZqGm07+2RIr0N+s2GfJL0pv9oVskxkLIGrfuqSJx6t3SI5Tu+FGI/FBkvx7e7PI0y4YpSlGrGO2QhuVvhdj8UbQVXxL4iIn5xXj8uMo9K8/IX5x/FppRsG+asoVY6+vL/SPSOv6Jy9DUUFRuuiApXRIUrosIVUeGKqHBFVLgiKlwRFa6IylHp+a4X7X7rPC8VeWfvV+Fw1+UqDofD4XA4HA6Hs0/wMRqFw9KzXb+I61vnGZ+wpvFVJqyLDa86UuGKqHBFVLgiKlwRFa6ICldEhSuiwhVROeIDEBq10s8/cHL5ufT4ASeXx7suV3E4HA6Hw+FwOAyx6/8h+tun9DcOhdKLA04uL3hJjQavOlLhiqhwRVS4IipcERWuiApXRIUrosIVUeGKqPAJayq10tPvObk8Le16Pvjbp/Qjh8Kui54cDofD4XA4HA5nj/g/U2iAKbs+CkgAAAAASUVORK5CYII=',
            plays: 1232,
        },
        {
            id: 3,
            name: 'United Kingdom',
            value: 110,
            image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Flag_of_the_United_Kingdom_%283-5%29.svg/2560px-Flag_of_the_United_Kingdom_%283-5%29.svg.png',
            plays: 5422,
        },
        {
            id: 4,
            name: 'Germany',
            value: 120,
            image: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASIAAACuCAMAAAClZfCTAAAAElBMVEUAAAD/zgDdAADnAADaAAD/2AAtsSEoAAAA+ElEQVR4nO3QMQGAMAAEsYeCf8tIuI0pkZANAAAAAAAAAAAAAAAAAAAAgB8dwm6CoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUqKkqKkKClKipKipCgpSoqSoqQoKUofMGTNC8HkSxoAAAAASUVORK5CYII=',
            plays: 6543,
        },
        {
            id: 5,
            name: 'Spain',
            value: 105,
            image: 'data:image/png;base64,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',
            plays: 2111,
        },
    ].sort((a, b) => b.plays - a.plays);

    const sortListRelease = fakeReleasesData
        .slice(0, 5)
        .sort((a, b) => b.plays - a.plays)
        .map((item) => ({
            id: item.id,
            image: item.thumbnail,
            title: item.title,
            artist: item.artist,
            value: item.plays,
            plays: item.plays,
        }));

    const sortListTrack = fakeTrackData
        .slice(0, 5)
        .sort((a, b) => b.plays - a.plays)
        .map((item) => ({
            id: item.id,
            image: item.thumbnail,
            title: item.title,
            artist: item.artists[0].name,
            value: item.plays,
            plays: item.plays,
        }));

    // Dữ liệu cho biểu đồ so sánh số plays của 5 quốc gia hàng đầu theo tháng
    const lineChartData = [
        {
            date: new Date(2024, 0, 1).getTime(),
            Germany: 2500,
            'United Kingdom': 3500,
            'Việt Nam': 1800,
            Spain: 900,
            'United States': 500,
        },
        {
            date: new Date(2024, 1, 1).getTime(),
            Germany: 2800,
            'United Kingdom': 3800,
            'Việt Nam': 2200,
            Spain: 1200,
            'United States': 700,
        },
        {
            date: new Date(2024, 2, 1).getTime(),
            Germany: 2000,
            'United Kingdom': 3000,
            'Việt Nam': 2800,
            Spain: 1500,
            'United States': 1000,
        },
        {
            date: new Date(2024, 3, 1).getTime(),
            Germany: 3500,
            'United Kingdom': 4200,
            'Việt Nam': 3100,
            Spain: 1800,
            'United States': 1300,
        },
        {
            date: new Date(2024, 4, 1).getTime(),
            Germany: 4000,
            'United Kingdom': 4500,
            'Việt Nam': 3500,
            Spain: 2200,
            'United States': 1500,
        },
        {
            date: new Date(2024, 5, 1).getTime(),
            Germany: 5500,
            'United Kingdom': 5000,
            'Việt Nam': 4000,
            Spain: 2500,
            'United States': 1800,
        },
        {
            date: new Date(2024, 6, 1).getTime(),
            Germany: 6500,
            'United Kingdom': 5500,
            'Việt Nam': 4200,
            Spain: 2800,
            'United States': 2000,
        },
        {
            date: new Date(2024, 7, 1).getTime(),
            Germany: 6000,
            'United Kingdom': 5200,
            'Việt Nam': 3800,
            Spain: 2600,
            'United States': 1900,
        },
        {
            date: new Date(2024, 8, 1).getTime(),
            Germany: 7000,
            'United Kingdom': 6000,
            'Việt Nam': 4500,
            Spain: 3000,
            'United States': 2200,
        },
        {
            date: new Date(2024, 9, 1).getTime(),
            Germany: 7200,
            'United Kingdom': 6200,
            'Việt Nam': 4700,
            Spain: 3200,
            'United States': 2400,
        },
    ];
    const top5Countries = regionData
        .slice(0, 5)
        .map((c) => ({ name: c.name, field: c.name }));

    // Chuẩn bị data cho DonutChartWithList
    const totalDspValue = fakeDspData.reduce(
        (sum, item) => sum + item.value,
        0
    );
    const donutData = fakeDspData.map((item, idx) => {
        const percent =
            totalDspValue > 0
                ? `+${Math.round((item.value / totalDspValue) * 100)}%`
                : '+0%';
        return {
            name: item.name,
            value: item.value,
            percent,
            image: item.image,
        };
    });

    return (
        <div>
            <DashboardHeader />

            <div className="flex flex-col gap-4 px-4 py-4">
                <CardStatistic />

                {/* <div className="grid w-full grid-cols-4 gap-4">
                    <TopList
                        data={sortListTrack}
                        title="Bài hát hàng đầu"
                        description="Bài hát"
                        className="flex-1"
                        initialTab={TOP_LIST_TYPE.LIST}
                        onClickSeeAll={() => {
                            router.push('/tracks');
                        }}
                    />
                    <TopList
                        data={sortListRelease}
                        title="Bản phát hành hàng đầu"
                        description="Bản phát hành"
                        className="flex-1"
                        initialTab={TOP_LIST_TYPE.LIST}
                        onClickSeeAll={() => {
                            router.push('/releases');
                        }}
                    />
                    <TopList
                        data={regionData.map((item) => ({
                            id: item.id,
                            title: item.name,
                            value: item.value,
                            image: item.image,
                            plays: item.plays,
                        }))}
                        title="Quốc gia hàng đầu"
                        description="Quốc gia"
                        className="flex-1"
                        initialTab={TOP_LIST_TYPE.LIST}
                        typeShapeImage="circle"
                    />

                    <TopList
                        data={fakeDspData.map((item) => ({
                            id: item.id,
                            title: item.name,
                            value: item.value,
                            image: item.image,
                            plays: item.plays,
                        }))}
                        title="DSP hàng đầu"
                        description="DSP"
                        className="flex-1"
                        initialTab={TOP_LIST_TYPE.LIST}
                        typeShapeImage="circle"
                    />
                </div> */}

                <div className="grid w-full grid-cols-12 gap-4">
                    <div className="col-span-8">
                        <div className="rounded-lg border bg-white p-4 shadow-sm">
                            <h3 className="mb-4 text-lg font-semibold text-gray-800">
                                Streaming Performance
                            </h3>
                            <LineChart
                                data={lineChartData}
                                series={top5Countries}
                            />
                        </div>
                    </div>
                    <div className="col-span-4 w-full">
                        <ListReport
                            data={donutData.sort((a, b) => b.value - a.value)}
                        />
                    </div>
                </div>

                <ListRelease data={fakeReleasesData.slice(0, 14)} />

                <ListNews />
            </div>
        </div>
    );
}

export default Dashboard;
