import SortedSet from 'collections/sorted-set';
import { Edge, AdjacencyList } from '../utils/interfaces/graph';

interface VWPair {
  vertex: string;
  weight: number;
}

const bidirectionalDijkstra = (
  targetVertices: Array<string>,
  adjacencyList: AdjacencyList,
  revAdjacencyList: AdjacencyList
): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  const parentF: { [prop: string]: VWPair } = {};
  const parentR: { [prop: string]: VWPair } = {};
  const distanceF: { [prop: string]: number } = {};
  const distanceR: { [prop: string]: number } = {};

  const procF: Set<string> = new Set<string>();
  const procR: Set<string> = new Set<string>();

  const setF = new SortedSet<VWPair>(
    [],
    (a, b) => a.vertex === b.vertex && a.weight === b.weight,
    (a, b) => {
      if (a.weight < b.weight) return -1;
      if (a.weight > b.weight) return 1;
      if (a.vertex !== b.vertex) return -1;
      return 0;
    }
  );

  const setR = new SortedSet<VWPair>(
    [],
    (a, b) => a.vertex === b.vertex && a.weight === b.weight,
    (a, b) => {
      if (a.weight < b.weight) return -1;
      if (a.weight > b.weight) return 1;
      if (a.vertex !== b.vertex) return -1;
      return 0;
    }
  );

  const edges: Array<Edge> = [];
  const allEdges: Array<Edge> = [];

  // Can be cached maybe
  // Object.keys(adjacencyList).map((key) => (distanceF[key] = Infinity));
  // Object.keys(adjacencyList).map((key) => (distanceR[key] = Infinity));

  let startingKey: string = targetVertices[0];
  let endingKey: string = targetVertices[1];

  distanceF[startingKey] = 0;
  distanceR[endingKey] = 0;
  parentF[startingKey] = { vertex: startingKey, weight: 0 };
  parentR[endingKey] = { vertex: endingKey, weight: 0 };
  setF.add({ vertex: startingKey, weight: 0 });
  setR.add({ vertex: endingKey, weight: 0 });

  while (setF.length > 0 && setR.length > 0) {
    const currentFObj = setF.min();
    if (!currentFObj) break;
    const currentF = currentFObj.vertex;
    setF.delete(currentFObj);

    for (let i = 0; i < adjacencyList[currentF].adj.length; i++) {
      const neighbourKey: string = adjacencyList[currentF].adj[i].toString();
      const currWeight: number = adjacencyList[currentF].w[i];
      const newWeight: number = distanceF[currentF] + currWeight;
      if (isNaN(distanceF[neighbourKey])) {
        distanceF[neighbourKey] = newWeight;
        setF.add({ vertex: neighbourKey, weight: distanceF[neighbourKey] });
        parentF[neighbourKey] = { vertex: currentF, weight: adjacencyList[currentF].w[i] };
      } else if (newWeight < distanceF[neighbourKey]) {
        setF.delete({ vertex: neighbourKey, weight: distanceF[neighbourKey] });
        distanceF[neighbourKey] = newWeight;
        setF.add({ vertex: neighbourKey, weight: distanceF[neighbourKey] });
        parentF[neighbourKey] = { vertex: currentF, weight: adjacencyList[currentF].w[i] };
      }
    }

    procF.add(currentF);

    allEdges.push({
      src: [adjacencyList[parentF[currentF].vertex].lat, adjacencyList[parentF[currentF].vertex].lon],
      dest: [adjacencyList[currentF].lat, adjacencyList[currentF].lon],
      weight: parentF[currentF].weight,
    });

    if (procR.has(currentF)) {
      break;
    }

    const currentRObj = setR.min();
    if (!currentRObj) break;
    const currentR = currentRObj.vertex;
    setR.delete(currentRObj);

    for (let i = 0; i < revAdjacencyList[currentR].adj.length; i++) {
      const neighbourKey: string = revAdjacencyList[currentR].adj[i].toString();
      const currWeight: number = revAdjacencyList[currentR].w[i];
      const newWeight: number = distanceR[currentR] + currWeight;
      if (isNaN(distanceR[neighbourKey])) {
        distanceR[neighbourKey] = newWeight;
        setR.add({ vertex: neighbourKey, weight: distanceR[neighbourKey] });
        parentR[neighbourKey] = { vertex: currentR, weight: revAdjacencyList[currentR].w[i] };
      } else if (newWeight < distanceR[neighbourKey]) {
        setR.delete({ vertex: neighbourKey, weight: distanceR[neighbourKey] });
        distanceR[neighbourKey] = newWeight;
        setR.add({ vertex: neighbourKey, weight: distanceR[neighbourKey] });
        parentR[neighbourKey] = { vertex: currentR, weight: revAdjacencyList[currentR].w[i] };
      }
    }

    procR.add(currentR);

    allEdges.push({
      src: [revAdjacencyList[parentR[currentR].vertex].lat, revAdjacencyList[parentR[currentR].vertex].lon],
      dest: [revAdjacencyList[currentR].lat, revAdjacencyList[currentR].lon],
      weight: parentR[currentR].weight,
    });

    if (procF.has(currentR)) {
      break;
    }
  }

  let distance: number = Infinity;
  let currBest: string = '';

  procF.forEach((vId) => {
    if (distanceF[vId] + distanceR[vId] < distance) {
      distance = distanceF[vId] + distanceR[vId];
      currBest = vId;
    }
  });

  procR.forEach((vId) => {
    if (distanceF[vId] + distanceR[vId] < distance) {
      distance = distanceF[vId] + distanceR[vId];
      currBest = vId;
    }
  });

  let last: string = currBest;

  console.log(distanceF[last], distanceR[last]);

  if (!parentF[last] || !parentR[last]) return { allEdges, edges };

  while (last !== startingKey) {
    edges.push({
      src: [adjacencyList[parentF[last].vertex].lat, adjacencyList[parentF[last].vertex].lon],
      dest: [adjacencyList[last].lat, adjacencyList[last].lon],
      weight: parentF[last].weight,
    });
    last = parentF[last].vertex;
  }

  edges.reverse();

  last = currBest;

  while (last !== endingKey) {
    edges.push({
      src: [adjacencyList[parentR[last].vertex].lat, adjacencyList[parentR[last].vertex].lon],
      dest: [adjacencyList[last].lat, adjacencyList[last].lon],
      weight: parentR[last].weight,
    });
    last = parentR[last].vertex;
  }

  return { allEdges, edges };
};

export default bidirectionalDijkstra;
