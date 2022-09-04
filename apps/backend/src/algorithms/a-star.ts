import SortedSet from 'collections/sorted-set';
import { heuristic } from '../utils/functions';
import { Edge, AdjacencyList, LatLon } from '../utils/interfaces/graph';

interface VWPair {
  vertex: string;
  weight: number;
}

const aStar = (targetVertices: Array<string>, adjacencyList: AdjacencyList): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  const parent: { [prop: string]: VWPair } = {};
  const distance: { [prop: string]: number } = {};
  const visited: { [prop: string]: boolean } = {};
  const edges: Array<Edge> = [];
  const allEdges: Array<Edge> = [];
  // Object.keys(adjacencyList).map((key) => (distance[key] = Infinity));

  let startingKey: string = targetVertices[0];
  let endingKey: string = targetVertices[1];

  const set = new SortedSet<VWPair>(
    [],
    (a, b) => a.vertex === b.vertex && a.weight === b.weight,
    (a, b) => {
      if (a.weight < b.weight) return -1;
      if (a.weight > b.weight) return 1;
      if (a.vertex !== b.vertex) return -1;
      return 0;
    }
  );

  distance[startingKey] = 0;
  visited[startingKey] = true;
  parent[startingKey] = { vertex: startingKey, weight: 0 };
  const hs = heuristic(
    { lat: adjacencyList[startingKey].lat, lon: adjacencyList[startingKey].lon },
    { lat: adjacencyList[endingKey].lat, lon: adjacencyList[endingKey].lon }
  );
  set.add({ vertex: startingKey, weight: hs });

  while (set.length > 0) {
    const currentObj = set.min();
    if (!currentObj) break;
    const current = currentObj.vertex;
    set.delete(currentObj);

    if (!current) break;

    visited[current] = true;

    allEdges.push({
      src: [adjacencyList[parent[current].vertex].lat, adjacencyList[parent[current].vertex].lon],
      dest: [adjacencyList[current].lat, adjacencyList[current].lon],
      weight: parent[current].weight,
    });

    if (current === endingKey) {
      console.log('breaked');
      break;
    }

    for (let i = 0; i < adjacencyList[current].adj.length; i++) {
      const neighbourKey: string = adjacencyList[current].adj[i].toString();
      const currWeight: number = adjacencyList[current].w[i];
      const newWeight: number = distance[current] + currWeight;

      if (visited[neighbourKey]) continue;

      if (isNaN(distance[neighbourKey]) || newWeight < distance[neighbourKey]) {
        const h = heuristic(
          { lat: adjacencyList[neighbourKey].lat, lon: adjacencyList[neighbourKey].lon },
          { lat: adjacencyList[endingKey].lat, lon: adjacencyList[endingKey].lon }
        );
        distance[neighbourKey] = newWeight;
        set.add({ vertex: neighbourKey, weight: distance[neighbourKey] + h });
        parent[neighbourKey] = { vertex: current, weight: adjacencyList[current].w[i] };
      }
    }
  }
  // aStar complete

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

export default aStar;
