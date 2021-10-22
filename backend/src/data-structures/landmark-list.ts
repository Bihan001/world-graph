import fs from 'fs';
import { AdjacencyList, FullAdjacencyList, LandMark } from '../utils/interfaces/graph';
import { regionsData } from '../data/regions';
import { addPointToAdjacencyList, deletePointFromAdjacencyList, findNeighboursOfPoints } from '../algorithms/algorithm-handler';
import landmarkScanDijkstra from '../algorithms/landmark-scan';
import scanAndSelectLandmarks from '../algorithms/scan-select-landmarks';

global.landmarks = {};

export const createLandmarks = () => {
  // readAllLandmarksFromDisk();
  createAndWriteAllLandmarks();
};

const readAllLandmarksFromDisk = () => {
  const path = '/home/bihan/codes/landmarks-washington.json';
  global.landmarks = JSON.parse(fs.readFileSync(path, 'utf-8'));
  console.log('Landmarks loaded');
  return;
};

const createAndWriteAllLandmarks = () => {
  const fullAdjacencyList: FullAdjacencyList = global.fullAdjacencyList;
  const startTimer = Date.now();
  Object.keys(fullAdjacencyList).map((region, idx) => {
    // const stream = fs.createWriteStream(`/home/bihan/codes/landmarks-${region}.json`, { flags: 'a' });
    // stream.write('[');
    const adjacencyList: AdjacencyList = fullAdjacencyList[region];
    const adjBounds = regionsData[region].boundary;
    let str = '';
    const landmarkIds: Array<string> = [];
    const l = Object.keys(adjacencyList).length;
    const initialRandomLandmarkId = Object.keys(adjacencyList)[Math.floor(Math.random() * l)];
    console.log('initial landmark id:', initialRandomLandmarkId);
    global.initialLandmark = initialRandomLandmarkId;
    const n = 23;
    global.landmarksCount = n;
    landmarkIds.push(initialRandomLandmarkId);
    for (let i = 0; i < n - 1; i++) {
      selectLandmarks(adjacencyList, landmarkIds);
    }
    landmarkIds.map((id) => {
      const distances = landmarkScanDijkstra(id, adjacencyList);
      const landmark: LandMark = {
        lat: adjacencyList[id].lat,
        lon: adjacencyList[id].lon,
        distances,
      };
      if (!global.landmarks[region]) global.landmarks[region] = {};
      global.landmarks[region][id] = landmark;
    });
    landmarkIds.map((id) => {
      console.log({ lat: adjacencyList[id].lat, lon: adjacencyList[id].lon });
    });
  });
  console.log('Landmarks ready!', `${(Date.now() - startTimer) / 60000} mins`);
};

const createAndFillLandmark = (adjacencyList: AdjacencyList, region: string, lat: number, lon: number) => {
  const { key, vertex, closestPoints } = findNeighboursOfPoints({ lat, lon }, 'large');
  addPointToAdjacencyList(adjacencyList, key, vertex, closestPoints);
  const distances = landmarkScanDijkstra(key, adjacencyList);
  deletePointFromAdjacencyList(adjacencyList, key, closestPoints);
  const landmark: LandMark = { lat, lon, distances };
  if (!global.landmarks[region]) global.landmarks[region] = {};
  global.landmarks[region][key] = landmark;
  return `"${key}":${JSON.stringify(landmark)}`;
};

const selectLandmarks = (adjacencyList: AdjacencyList, landmarkIds: Array<string>) => {
  landmarkIds.push(scanAndSelectLandmarks(adjacencyList, landmarkIds));
};
