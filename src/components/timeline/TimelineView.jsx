import { useStoryStore } from '../../store/useStoryStore';

export const TimelineView = () => {
  const { timelineData } = useStoryStore();

  if (!timelineData) return null;

  return (
    <div className="p-6 space-y-4">
      {timelineData.map(ev => (
        <div
          key={ev.id}
          className="p-4 bg-slate-900 rounded-xl"
        >
          <h3 className="text-white">{ev.title}</h3>
          <p className="text-slate-400 text-sm">{ev.summary}</p>
        </div>
      ))}
    </div>
  );
};