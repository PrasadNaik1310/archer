import { LineChart, Line, ResponsiveContainer, Tooltip } from 'recharts';

export const SentimentChart = ({ data }) => (
  <div className="h-32 w-full mt-4">
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }} />
        <Line type="monotone" dataKey="sentiment" stroke="#3b82f6" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  </div>
);

export default SentimentChart;