import { Vertex, Edge, AdjacencyList } from '../utilities/interfaces/graph';

const bellmanFord = (
  targetVertices: Array<string>,
  adjacencyList: AdjacencyList
): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  const parent: { [prop: string]: { vertex: string; weight: number } } = {};
  const distance: { [prop: string]: number } = {};
  const edges: Array<Edge> = [];
  const allEdges: Array<Edge> = [];

  Object.keys(adjacencyList).map((key) => (distance[key] = Infinity));

  let startingKey: string = targetVertices[0];
  let endingKey: string = targetVertices[1];
  distance[startingKey] = 0;

  const edgeList: Array<{ srcId: string; destId: string; weight: number }> = [];

  const tmpEdgeSet: Set<string> = new Set();

  Object.keys(adjacencyList).map((key) => {
    const vertex: Vertex = adjacencyList[key];
    const src = key;
    vertex.adj.map((adjKey, idx) => {
      const dest: string = adjKey.toString();
      const weight: number = vertex.w[idx];
      const newStr = src + '#' + dest + '#' + weight;
      const existingStr = dest + '#' + src + '#' + weight;
      if (!tmpEdgeSet.has(existingStr)) {
        tmpEdgeSet.add(newStr);
      }
    });
  });

  tmpEdgeSet.forEach((edgeStr) => {
    const [srcId, destId, weight] = edgeStr.split('#');
    edgeList.push({ srcId, destId, weight: +weight });
  });

  Object.keys(adjacencyList).map((_, i) => {
    edgeList.map((edge, j) => {
      const srcId = edge.srcId;
      const destId = edge.destId;
      const weight = edge.weight;

      allEdges.push({
        src: [adjacencyList[srcId].lat, adjacencyList[srcId].lon],
        dest: [adjacencyList[destId].lat, adjacencyList[destId].lon],
        weight: weight,
      });

      let newDistance = distance[srcId] + weight;
      if (newDistance < distance[destId]) {
        distance[destId] = newDistance;
        parent[destId] = { vertex: srcId, weight: weight };
      }
    });
  });

  // bellmanFord complete

  if (!parent[endingKey]) return { allEdges, edges };

  while (endingKey !== startingKey) {
    edges.push({
      src: [adjacencyList[parent[endingKey].vertex].lat, adjacencyList[parent[endingKey].vertex].lon],
      dest: [adjacencyList[endingKey].lat, adjacencyList[endingKey].lon],
      weight: parent[endingKey].weight,
    });
    endingKey = parent[endingKey].vertex;
  }

  edges.reverse();

  return { allEdges, edges };
};

export default bellmanFord;
