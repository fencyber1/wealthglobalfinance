import React, { useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';

interface PaymentsChartProps {
  data: { day: string; amount: number }[];
}

export default function PaymentsChart({ data }: PaymentsChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const maxAmount = Math.max(...data.map((d) => d.amount));
  const highlightIndex = data.findIndex((d) => d.amount === maxAmount);

  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-b from-white/[0.08] to-white/[0.02] overflow-hidden h-full">
      <div className="rounded-[calc(1.4rem-1px)] p-5 bg-[#0A1628] h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-sm font-bold text-white">Payments</h3>
          <span className="px-2.5 py-1 bg-white text-[#0A1628] text-[10px] font-bold rounded-md shadow-lg">
            65%
          </span>
        </div>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              onMouseMove={(e) => {
                if (e?.activeTooltipIndex !== undefined) {
                  setHoveredIndex(e.activeTooltipIndex);
                }
              }}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <XAxis dataKey="day" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '12px', fontSize: '12px' }}
                labelStyle={{ color: '#f97316', fontWeight: 'bold' }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, '']}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={20}>
                {data.map((_, index) => (
                  <Cell
                    key={index}
                    fill={index === highlightIndex ? '#f97316' : '#7c3aed'}
                    opacity={hoveredIndex !== null && hoveredIndex !== index ? 0.3 : 0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
