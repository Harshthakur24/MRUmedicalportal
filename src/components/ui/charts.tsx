'use client';

import { Card } from "@/components/ui/card";
import {
    LineChart as RechartsLineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
    BarChart as RechartsBarChart,
    Bar,
} from "recharts";

interface ChartProps {
    data: any[];
    xAxis: string;
    series: { key: string; label: string }[];
}

const COLORS = ["#004a7c", "#2E8BC0", "#145DA0", "#0C2D48"];

export function LineChart({ data, xAxis, series }: ChartProps) {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {series.map((s, index) => (
                        <Line
                            key={s.key}
                            type="monotone"
                            dataKey={s.key}
                            name={s.label}
                            stroke={COLORS[index % COLORS.length]}
                            activeDot={{ r: 8 }}
                        />
                    ))}
                </RechartsLineChart>
            </ResponsiveContainer>
        </div>
    );
}

export function BarChart({ data, xAxis, series }: ChartProps) {
    return (
        <div className="h-[400px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <RechartsBarChart
                    data={data}
                    margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey={xAxis} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {series.map((s, index) => (
                        <Bar
                            key={s.key}
                            dataKey={s.key}
                            name={s.label}
                            fill={COLORS[index % COLORS.length]}
                        />
                    ))}
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    );
} 