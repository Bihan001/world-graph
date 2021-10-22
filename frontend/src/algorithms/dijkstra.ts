import { Edge, AdjacencyList } from '../utilities/interfaces/graph';

const findAndDelete = (arr: Array<{ vertex: string; weight: number }>, v: string, w: number) => {
  let i = arr.findIndex((item) => item.vertex === v && item.weight === w);
  if (i >= 0) arr.splice(i, 1);
};

const dijkstra = (
  targetVertices: Array<string>,
  adjacencyList: AdjacencyList
): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  const parent: { [prop: string]: { vertex: string; weight: number } } = {};
  const distance: { [prop: string]: number } = {};
  const edges: Array<Edge> = [];
  const allEdges: Array<Edge> = [];
  Object.keys(adjacencyList).map((key) => (distance[key] = Infinity));

  const pq: Array<{ vertex: string; weight: number }> = [];

  let startingKey: string = targetVertices[0];
  let endingKey: string = targetVertices[1];

  distance[startingKey] = 0;
  parent[startingKey] = { vertex: startingKey, weight: 0 };
  pq.push({ vertex: startingKey, weight: 0 });

  while (pq.length > 0) {
    pq.sort((a, b) => a.weight - b.weight);
    const current: string = pq[0].vertex;
    pq.splice(0, 1);

    if (!current) break;

    allEdges.push({
      src: [adjacencyList[parent[current].vertex].lat, adjacencyList[parent[current].vertex].lon],
      dest: [adjacencyList[current].lat, adjacencyList[current].lon],
      weight: parent[current].weight,
    });

    // if (current === endingKey) break;

    for (let i = 0; i < adjacencyList[current].adj.length; i++) {
      const neighbourKey: string = adjacencyList[current].adj[i].toString();
      const currWeight: number = adjacencyList[current].w[i];
      if (distance[current] + currWeight < distance[neighbourKey]) {
        findAndDelete(pq, neighbourKey, currWeight);
        distance[neighbourKey] = distance[current] + currWeight;
        pq.push({ vertex: neighbourKey, weight: distance[neighbourKey] });
        parent[neighbourKey] = { vertex: current, weight: adjacencyList[current].w[i] };
      }
    }
  }
  // dijkstra complete

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

export default dijkstra;
