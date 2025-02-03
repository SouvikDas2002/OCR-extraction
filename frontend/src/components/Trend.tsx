import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TrendChartProps {
  xy: number[] | undefined;
}

const TrendChart: React.FC<TrendChartProps> = ({ xy }) => {
  console.log(xy);
  const data = xy ? xy.map((value, index) => ({ x: index, y: value })) : [];

  return (
    <ResponsiveContainer width={300} height={150}>
      <LineChart data={data}>
        <XAxis dataKey="x" hide />
        <YAxis hide />
        <Tooltip cursor={{ strokeDasharray: "3 3" }} />
        <Line
          type="monotone"
          dataKey="y"
          stroke="#00c6ff"
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default TrendChart;
