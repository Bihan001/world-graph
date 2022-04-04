require('dotenv').config({ path: process.env.NODE_ENV === 'production' ? 'prod.env' : 'dev.env' });
import app from './app';
import { FullAdjacencyList, LandMarks } from './utils/interfaces/graph';
import mongoose from 'mongoose';
import { fetchAllRegionsFromDB } from './data-structures/adjacency-list';
import { createLatLonIndexTree } from './data-structures/lat-lon-index-tree';
import { createLandmarks } from './data-structures/landmark-list';
import ContractionHierarchy from './data-structures/contraction-hierarchy';

declare global {
  namespace NodeJS {
    interface Global {
      fullAdjacencyList: FullAdjacencyList;
      revFullAdjacencyList: FullAdjacencyList;
      landmarks: LandMarks;
      initialLandmark: string;
      landmarksCount: number;
      contractionHierarchy: ContractionHierarchy;
    }
  }
}

fetchAllRegionsFromDB().then(() => {
  console.log('Fetched all data from DB');
  createLatLonIndexTree();
  createLandmarks();
  const startTime = Date.now();
  const ch = new ContractionHierarchy();
  // console.log('CH class:', ch);
  global.contractionHierarchy = ch;
  console.log('CH preprocessing time:', (Date.now() - startTime) / 60000, 'mins');
});

// Variables
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log('Server is running at ' + PORT));
