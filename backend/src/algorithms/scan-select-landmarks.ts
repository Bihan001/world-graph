import SortedSet from 'collections/sorted-set';
import { AdjacencyList } from '../utils/interfaces/graph';

interface VWPair {
  vertex: string;
  weight: number;
}

const scanAndSelectLandmarks = (adjacencyList: AdjacencyList, landmarkIds: Array<string>): string => {
  const distance: { [prop: string]: number } = {};

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

  landmarkIds.map((id) => {
    distance[id] = 0;
    set.add({ vertex: id, weight: 0 });
  });

  while (set.length > 0) {
    const currentObj = set.min();
    if (!currentObj) break;
    const current = currentObj.vertex;
    set.delete(currentObj);

    if (!current) break;

    for (let i = 0; i < adjacencyList[current].adj.length; i++) {
      const neighbourKey: string = adjacencyList[current].adj[i].toString();
      const currWeight: number = adjacencyList[current].w[i];
      const newWeight: number = distance[current] + currWeight;
      if (isNaN(distance[neighbourKey])) {
        distance[neighbourKey] = newWeight;
        set.add({ vertex: neighbourKey, weight: distance[neighbourKey] });
      } else if (newWeight < distance[neighbourKey]) {
        set.delete({ vertex: neighbourKey, weight: distance[neighbourKey] });
        distance[neighbourKey] = newWeight;
        set.add({ vertex: neighbourKey, weight: distance[neighbourKey] });
      }
    }
  }
  // scanAndSelectLandmarks complete

  let maxVal = -9999999;
  let vId = '';

  Object.keys(distance).map((id) => {
    if (distance[id] > maxVal) {
      maxVal = distance[id];
      vId = id;
    }
  });

  return vId;
};

export default scanAndSelectLandmarks;
