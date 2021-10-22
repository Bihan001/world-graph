import { Edge, AdjacencyList } from '../utilities/interfaces/graph';

const floydWarshall = (
  targetVertices: Array<string>,
  adjacencyList: AdjacencyList
): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  const visited: { [prop: string]: boolean } = {};
  const parent: { [prop: string]: { vertex: string; weight: number } } = {};
  const edges: Array<Edge> = [];
  const allEdges: Array<Edge> = [];
  Object.keys(adjacencyList).map((key) => (visited[key] = false));
  const queue: Array<{ vertex: string; weight: number }> = [];

  let startingKey: string = targetVertices[0];
  let endingKey: string = targetVertices[1];

  visited[startingKey] = true;
  parent[startingKey] = { vertex: startingKey, weight: 0 };
  queue.push({ vertex: startingKey, weight: 0 });

  while (queue.length > 0) {
    const top: { vertex: string; weight: number } | null = queue.shift() || null;
    if (!top) break;

    allEdges.push({
      src: [adjacencyList[parent[top.vertex].vertex].lat, adjacencyList[parent[top.vertex].vertex].lon],
      dest: [adjacencyList[top.vertex].lat, adjacencyList[top.vertex].lon],
      weight: parent[top.vertex].weight,
    });

    if (top?.vertex === endingKey) break;

    for (let i = 0; i < adjacencyList[top.vertex].adj.length; i++) {
      const neighbourKey: string = adjacencyList[top.vertex].adj[i].toString();
      if (!visited[neighbourKey]) {
        visited[neighbourKey] = true;
        queue.push({ vertex: neighbourKey, weight: adjacencyList[top.vertex].w[i] });
        parent[neighbourKey] = { vertex: top.vertex, weight: adjacencyList[top.vertex].w[i] };
      }
    }
  }
  // floydWarshall complete

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

export default floydWarshall;
