import SentimentChart from './SentimentChart.jsx';
import PredictionPanel from './PredictionPanel.jsx';
import Badge from '../ui/Badge.jsx';

export const StoryDashboard = ({ data }) => (
  <div className="p-6 space-y-8 overflow-y-auto h-full custom-scrollbar">
    <div>
      <Badge variant="positive">Intelligence Active</Badge>
      <h1 className="text-3xl font-black text-white mt-4 leading-tight">{data.title}</h1>
      <p className="text-sm text-slate-400 mt-3 leading-relaxed">{data.description}</p>
    </div>
    <section>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">Sentiment Arc</h4>
      <SentimentChart data={data.sentimentTrend} />
    </section>
    <section>
      <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest border-b border-slate-800 pb-2">AI Predictions</h4>
      <PredictionPanel predictions={data.predictions} />
    </section>
  </div>
);