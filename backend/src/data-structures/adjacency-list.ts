import axios from 'axios';
import fs from 'fs';
import { AdjacencyList, FullAdjacencyList } from '../utils/interfaces/graph';
import { regionsData } from '../data/regions';

global.fullAdjacencyList = {};
global.revFullAdjacencyList = {};

export const fetchAllRegionsFromDB = async () => {
  try {
    await Promise.all(
      Object.keys(regionsData).map(async (key) => {
        const region = regionsData[key];
        // const res = await axios.get(region.dataUrl);
        // const adjList: AdjacencyList = res.data;
        const adjList: AdjacencyList = JSON.parse(fs.readFileSync(region.dataUrl, 'utf-8'));
        console.log('Vertices:', Object.keys(adjList).length);
        global.fullAdjacencyList[key] = adjList;
        global.revFullAdjacencyList[key] = adjList;
      })
    );

    console.log(Object.keys(global.fullAdjacencyList).length);
    console.log(Object.keys(global.revFullAdjacencyList).length);
  } catch (err: any) {
    console.error(err.message);
  }
};
