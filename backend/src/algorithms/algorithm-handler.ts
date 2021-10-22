import { latLonIndexTree } from '../data-structures/lat-lon-index-tree';
import { algorithmsData } from '../data/algorithms';
import { regionsData } from '../data/regions';
import { AdjacencyList, Edge, LatLon, Vertex } from '../utils/interfaces/graph';
import bfs from './bfs';
import dijkstra from './dijkstra';
import bidirectionalDijkstra from './bidirectional-dijkstra';
import aStar from './a-star';
import bidirectionalAStar from './bidirectional-a-star';
import bidirectionalAStarALT from './bidirectional-a-star-alt';
import fs from 'fs';

const currentTime = new Date().toLocaleTimeString().split(' ').join('-').toLowerCase();
if (fs.existsSync('./logs/info.log')) {
  fs.unlinkSync('./logs/info.log');
}
const stream = fs.createWriteStream(`./logs/info.log`, { flags: 'a' });
const streamBkp = fs.createWriteStream(`./logs/info-${currentTime}.log`, { flags: 'a' });

export const handleAlgorithmExec = (
  region: string,
  algorithm: string,
  pointA: LatLon,
  pointB: LatLon
): Error | { edges: Array<Edge>; allEdges: Array<Edge> } => {
  if (!algorithmsData[algorithm]) return new Error('Invalid algorithm');
  if (!regionsData[region]) return new Error('Invalid region');

  const fullAdjacencyList = global.fullAdjacencyList;
  const revFullAdjacencyList = global.revFullAdjacencyList;
  const adjacencyList: AdjacencyList = fullAdjacencyList[region];
  const revAdjacencyList: AdjacencyList = revFullAdjacencyList[region];
  // Get closest vertices of the selected points
  const { key: keyA, vertex: vertexA, closestPoints: closestPointsA } = findNeighboursOfPoints(pointA);
  const { key: keyB, vertex: vertexB, closestPoints: closestPointsB } = findNeighboursOfPoints(pointB);

  // Add them to adj list
  addPointToAdjacencyList(adjacencyList, keyA, vertexA, closestPointsA);
  addPointToAdjacencyList(adjacencyList, keyB, vertexB, closestPointsB);

  const landmarksOfRegion = global.landmarks[region];
  Object.keys(landmarksOfRegion).map((landmarkId) => {
    const landmark = landmarksOfRegion[landmarkId];
    let minDistA = Infinity;
    let minDistB = Infinity;
    vertexA.adj.map((id) => {
      minDistA = Math.min(minDistA, landmark.distances[id]);
    });
    vertexB.adj.map((id) => {
      minDistB = Math.min(minDistB, landmark.distances[id]);
    });
    landmark.distances[keyA] = minDistA;
    landmark.distances[keyB] = minDistB;
  });

  // Run algorithm
  const start = new Date().getTime();
  // const { allEdges, edges } = filterAndExecAlgorithm(algorithm, [keyA, keyB], adjacencyList, revAdjacencyList, region);
  const { allEdges, edges } = filterAndExecAlgorithm(
    algorithm,
    [keyA, keyB],
    [closestPointsA[0].toString(), closestPointsB[0].toString()],
    adjacencyList,
    revAdjacencyList,
    region
  );

  const end = new Date().getTime();
  const execTime = end - start;
  console.info('Execution time: %dms', execTime);

  // Logging execution times
  const execTimeLogObj = {
    initialLandmark: global.initialLandmark,
    landmarksCount: global.landmarksCount,
    algorithm,
    execTime,
    pointA,
    pointB,
  };
  stream.write(JSON.stringify(execTimeLogObj) + '\n', (err) => {
    if (err) {
      console.error(err.message);
    }
  });
  streamBkp.write(JSON.stringify(execTimeLogObj) + '\n', (err) => {
    if (err) {
      console.error(err.message);
    }
  });

  // Remove the vertices from list
  deletePointFromAdjacencyList(adjacencyList, keyA, closestPointsA);
  deletePointFromAdjacencyList(adjacencyList, keyB, closestPointsB);

  Object.keys(landmarksOfRegion).map((landmarkId) => {
    const landmark = landmarksOfRegion[landmarkId];
    delete landmark.distances[keyA];
    delete landmark.distances[keyB];
  });

  // return the resultant allEdges and edges
  return { edges, allEdges };
};

const filterAndExecAlgorithm = (
  algorithm: string,
  targetVertices: Array<string>,
  closestVertices: Array<string>,
  adjacencyList: AdjacencyList,
  revAdjacencyList: AdjacencyList,
  region: string
): { allEdges: Array<Edge>; edges: Array<Edge> } => {
  if (algorithm === 'bfs') return bfs(targetVertices, adjacencyList);
  if (algorithm === 'dijkstra') return dijkstra(targetVertices, adjacencyList);
  if (algorithm === 'contractionHierarchy') {
    const { allEdges, edges } = global.contractionHierarchy.query(+closestVertices[0], +closestVertices[1]);
    return { allEdges, edges };
  }
  if (algorithm === 'bidirectionalDijkstra') return bidirectionalDijkstra(targetVertices, adjacencyList, revAdjacencyList);
  if (algorithm === 'aStar') return aStar(targetVertices, adjacencyList);
  if (algorithm === 'bidirectionalAStar') return bidirectionalAStar(targetVertices, adjacencyList, revAdjacencyList);
  if (algorithm === 'bidirectionalAStarALT')
    return bidirectionalAStarALT(targetVertices, adjacencyList, revAdjacencyList, region);
  return { allEdges: [], edges: [] };
};

export const addPointToAdjacencyList = (
  adjacencyList: AdjacencyList,
  newKey: string,
  newVertex: Vertex,
  closestPoints: Array<number>
) => {
  adjacencyList[newKey] = newVertex;
  closestPoints.map((key) => {
    const currentVertex: Vertex = adjacencyList[key];
    adjacencyList[key] = { ...currentVertex, adj: [...currentVertex.adj, +newKey], w: [...currentVertex.w, 0] };
  });
};

export const deletePointFromAdjacencyList = (adjacencyList: AdjacencyList, newKey: string, closestPoints: Array<number>) => {
  delete adjacencyList[newKey];
  closestPoints.map((key) => {
    const vertex: Vertex = adjacencyList[key];
    const idx = vertex.adj.indexOf(+newKey);
    if (idx >= 0) {
      vertex.adj.splice(idx, 1);
      vertex.w.splice(idx, 1);
    }
  });
};

export const findNeighboursOfPoints = (
  point: LatLon,
  areaToScan: string = 'normal'
): { key: string; vertex: Vertex; closestPoints: Array<number> } => {
  let closeLats: Array<string> = [];
  let closeLons: Array<string> = [];
  let closeFinal: Array<number> = [];
  let incVal = 0.0001;
  let i = incVal;

  while (closeFinal.length === 0 && i <= (areaToScan === 'normal' ? 0.01 : 0.1)) {
    // Will contain keys from adjacency list that have close latitudes
    closeLats = [
      ...(latLonIndexTree.latitudes[+point.lat.toFixed(3)] || []),
      ...(latLonIndexTree.latitudes[(+point.lat.toFixed(3) - i).toFixed(3)] || []),
      ...(latLonIndexTree.latitudes[(+point.lat.toFixed(3) + i).toFixed(3)] || []),
    ];

    // Will contain keys from adjacency list that have close longitudes
    closeLons = [
      ...(latLonIndexTree.longitudes[+point.lon.toFixed(3)] || []),
      ...(latLonIndexTree.longitudes[(+point.lon.toFixed(3) - i).toFixed(3)] || []),
      ...(latLonIndexTree.longitudes[(+point.lon.toFixed(3) + i).toFixed(3)] || []),
    ];

    closeFinal = closeLats.filter((key) => closeLons.includes(key)).map((x) => +x);
    closeFinal = [...new Set(closeFinal)];
    i += incVal;
  }

  const newKey: string = `${Date.now()}${Math.floor(Math.random() * (1000 - 100 + 1)) + 100}`;
  const newVertex: Vertex = {
    lat: point.lat,
    lon: point.lon,
    adj: closeFinal,
    w: new Array(closeFinal.length).fill(0),
  };

  return { key: newKey, vertex: newVertex, closestPoints: closeFinal };
};
