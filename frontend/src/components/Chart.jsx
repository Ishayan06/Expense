// 
import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

function Chart({ data = [] }) {
  return (
    <div className="w-[75vw] m-auto h-[300px] sm:h-[400px] bg-white p-4 shadow-lg rounded-lg">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="income" fill="#6366f1" name="Income" barSize={40} />
          <Bar dataKey="expense" fill="#ef4444" name="Expense" barSize={40} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default Chart;
