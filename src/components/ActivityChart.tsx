import React, { useState } from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from 'recharts';

interface ActivityChartProps {
  data: { day: string; amount: number }[];
}

export default function ActivityChart({ data }: ActivityChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const totalAmount = data.reduce((sum, d) => sum + d.amount, 0);

  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden h-full">
      <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628] h-full">
        <h3 className="text-sm font-bold text-white mb-4">Activity</h3>
        <div className="relative h-40 w-full">
          {/* Floating label */}
          <div className="absolute top-2 left-1/3 z-10">
            <span className="px-2.5 py-1 bg-white text-[#0A1628] text-[10px] font-bold rounded-md shadow-lg">
              ${totalAmount.toLocaleString()}
            </span>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              onMouseMove={(e) => {
                if (e?.activeTooltipIndex !== undefined) {
                  setHoveredIndex(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <defs>
                <linearGradient id="activityGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#a855f7" stopOpacity={0.5} />
                  <stop offset="100%" stopColor="#a855f7" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(168,85,247,0.3)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#a855f7', fontWeight: 'bold' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Area
                type="monotone"
                dataKey="amount"
                stroke="#a855f7"
                strokeWidth={2.5}
                fill="url(#activityGradient)"
                dot={false}
                activeDot={{ r: 4, fill: '#a855f7', stroke: '#0A1628', strokeWidth: 2 }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
