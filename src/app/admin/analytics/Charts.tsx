'use client';

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';
import type {
  ComplaintsByCategory,
  ComplaintsByHostel,
  ComplaintsByStatus,
  AvgResolutionByCategory,
} from '@/lib/types';

const STATUS_COLORS: Record<string, string> = {
  Submitted:   '#94a3b8',
  Assigned:    '#38bdf8',
  In_Progress: '#fbbf24',
  Resolved:    '#34d399',
  Reopened:    '#a78bfa',
};


interface CategoryBarChartProps {
  data: ComplaintsByCategory[];
}
export function CategoryBarChart({ data }: CategoryBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 40 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="category_name" tick={{ fontSize: 11 }} angle={-30} textAnchor="end" />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="total_complaints" name="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="resolved_count" name="Resolved" fill="#34d399" radius={[4, 4, 0, 0]} />
        <Bar dataKey="open_count" name="Open" fill="#fbbf24" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface HostelBarChartProps {
  data: ComplaintsByHostel[];
}
export function HostelBarChart({ data }: HostelBarChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={data} margin={{ top: 4, right: 12, left: 0, bottom: 10 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="hostel_name" tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend verticalAlign="top" wrapperStyle={{ fontSize: 12 }} />
        <Bar dataKey="total_complaints" name="Total" fill="#6366f1" radius={[4, 4, 0, 0]} />
        <Bar dataKey="open_complaints" name="Open" fill="#ef4444" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

interface StatusPieChartProps {
  data: ComplaintsByStatus[];
}
export function StatusPieChart({ data }: StatusPieChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          dataKey="total"
          nameKey="status"
          cx="50%"
          cy="50%"
          outerRadius={80}
          label={({ name, percent }: { name?: string; percent?: number }) =>
            `${String(name ?? '').replace('_', ' ')} ${((percent ?? 0) * 100).toFixed(0)}%`
          }
          labelLine={false}
        >
          {data.map((entry) => (
            <Cell
              key={entry.status}
              fill={STATUS_COLORS[entry.status] ?? '#94a3b8'}
            />
          ))}
        </Pie>
        <Tooltip formatter={(v, name) => [v, String(name).replace('_', ' ')]} />
      </PieChart>
    </ResponsiveContainer>
  );
}

interface AvgResolutionChartProps {
  data: AvgResolutionByCategory[];
}
export function AvgResolutionChart({ data }: AvgResolutionChartProps) {
  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 40, left: 10, bottom: 4 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis type="number" tick={{ fontSize: 11 }} unit=" hrs" />
        <YAxis dataKey="category_name" type="category" tick={{ fontSize: 11 }} width={110} />
        <Tooltip formatter={(v) => [`${v} hours`, 'Avg Resolution Time']} />
        <Bar dataKey="avg_resolution_hours" name="Avg Resolution (hrs)" fill="#6366f1" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
