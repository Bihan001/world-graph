import { AdjacencyList, LatLonIndexTree, Vertex } from '../utils/interfaces/graph';

export const latLonIndexTree: LatLonIndexTree = { latitudes: {}, longitudes: {} };

export const createLatLonIndexTree = () => {
  const fullAdjacencyList = global.fullAdjacencyList;
  Object.keys(fullAdjacencyList).map((regionKey) => {
    const region: AdjacencyList = fullAdjacencyList[regionKey];
    Object.keys(region).map((key) => {
      const vertex: Vertex = region[key];

      const targetLat = vertex.lat.toFixed(3);
      const targetLon = vertex.lon.toFixed(3);

      if (latLonIndexTree.latitudes[targetLat]) latLonIndexTree.latitudes[targetLat].push(key);
      else latLonIndexTree.latitudes[targetLat] = [key];

      if (latLonIndexTree.longitudes[targetLon]) latLonIndexTree.longitudes[targetLon].push(key);
      else latLonIndexTree.longitudes[targetLon] = [key];
    });
  });
};
