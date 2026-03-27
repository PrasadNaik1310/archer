import { graphData } from '../data/mockGraph';
import { useStoryStore } from '../store/useStoryStore';

export const CategorySelector = () => {
  const { setGraph } = useStoryStore();

  const handleSelect = () => {
    const nodes = graphData.category.map((c, i) => ({
      id: c.id,
      position: { x: i * 300, y: 200 }, // better spacing
      data: c,
      type: 'custom'
    }));

    const edges = nodes.slice(1).map((n, i) => ({
      id: `e-${i}`,
      source: nodes[0].id,
      target: n.id,
    }));

    setGraph(nodes, edges, 'category');
  };

  return (
    <div className="h-screen flex items-center justify-center">
      <button
        onClick={handleSelect}
        className="px-6 py-4 bg-blue-600 rounded-xl text-white"
      >
        Start Exploring
      </button>
    </div>
  );
};