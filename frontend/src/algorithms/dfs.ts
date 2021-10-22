import { Edge, AdjacencyList } from '../utilities/interfaces/graph';

const dfs = (
  targetVertices: Array<string>,
  adjacencyList: AdjacencyList
): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  const visited: { [prop: string]: boolean } = {};
  const parent: { [prop: string]: { vertex: string; weight: number } } = {};
  const edges: Array<Edge> = [];
  const allEdges: Array<Edge> = [];
  Object.keys(adjacencyList).map((key) => (visited[key] = false));

  let startingKey: string = targetVertices[0];
  let endingKey: string = targetVertices[1];

  visited[startingKey] = true;
  parent[startingKey] = { vertex: startingKey, weight: 0 };

  dfsUtil(startingKey, endingKey, { shouldReturn: false }, visited, allEdges, parent, adjacencyList);

  // dfs comlete

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

const dfsUtil = (
  start: string,
  end: string,
  returnAtOnce: { shouldReturn: boolean },
  visited: { [prop: string]: boolean },
  allEdges: Array<Edge>,
  parent: { [prop: string]: { vertex: string; weight: number } },
  adjacencyList: AdjacencyList
) => {
  if (returnAtOnce.shouldReturn) return;

  visited[start] = true;

  allEdges.push({
    src: [adjacencyList[parent[start].vertex].lat, adjacencyList[parent[start].vertex].lon],
    dest: [adjacencyList[start].lat, adjacencyList[start].lon],
    weight: parent[start].weight,
  });

  if (start === end) returnAtOnce.shouldReturn = true;

  for (let i = 0; i < adjacencyList[start].adj.length; i++) {
    let neighbourKey: string = adjacencyList[start].adj[i].toString();
    if (!visited[neighbourKey]) {
      parent[neighbourKey] = { vertex: start, weight: adjacencyList[start].w[i] };
      dfsUtil(neighbourKey.toString(), end, returnAtOnce, visited, allEdges, parent, adjacencyList);
    }
  }
};

export default dfs;
