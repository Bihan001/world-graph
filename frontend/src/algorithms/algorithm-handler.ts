import { Edge, AdjacencyList } from '../utilities/interfaces/graph';
import bfs from './bfs';
import dfs from './dfs';
import dijkstra from './dijkstra';
import bellmanFord from './bellman-ford';
import floydWarshall from './flyod-warshall';

export const handleAlgoExecution = (
  algorithmName: string,
  targetVertices: Array<string>,
  adjacencyList: AdjacencyList
): { allEdges: Array<Edge>; edges: Array<Edge> } | Error => {
  if (!algorithmName.trim()) return new Error('Select an algorithm!');

  let res: { allEdges: Edge[]; edges: Edge[] } = { allEdges: [], edges: [] };

  if (targetVertices.length !== 2) return new Error('Select two vertices');

  if (!adjacencyList[targetVertices[0]] || !adjacencyList[targetVertices[1]]) {
    return new Error('Vertices are not defined');
  }

  if (algorithmName === 'bfs') res = bfs(targetVertices, adjacencyList);
  if (algorithmName === 'dfs') res = dfs(targetVertices, adjacencyList);
  if (algorithmName === 'dijkstra') res = dijkstra(targetVertices, adjacencyList);
  if (algorithmName === 'bellman') res = bellmanFord(targetVertices, adjacencyList);
  if (algorithmName === 'floyd') res = floydWarshall(targetVertices, adjacencyList);

  return res;
};
