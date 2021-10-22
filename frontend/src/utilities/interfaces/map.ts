import { MutableRefObject } from 'react';
import { AdjacencyList, Edge, LatLon, Vertex } from './graph';
import { Region } from './misc';

export interface Viewport {
  lat: number;
  lon: number;
  zoom: number;
}

export interface Map {
  edgeList: Array<Edge>;
  allEdgeList: Array<Edge>;
  viewport: Viewport;
  currentRegion: Region;
  traceEdgeColor: string;
  mainEdgeColor: string;
  trafficData: Array<string>;
  showTraffic: boolean;
  targetMarkers: Array<LatLon>;
  setTargetMarkers: React.Dispatch<React.SetStateAction<Array<LatLon>>>;
}
