export interface Vertex {
  lat: number;
  lon: number;
  adj: Array<number>;
  w: Array<number>;
}

export interface Edge {
  src: Array<number>;
  dest: Array<number>;
  weight: number;
}

export interface AdjacencyList {
  [index: string]: Vertex;
}

export interface FullAdjacencyList {
  [key: string]: AdjacencyList;
}

export interface LatLon {
  lat: number;
  lon: number;
}

export interface LatIndexTree {
  [key: string]: Array<string>;
}

export interface LonIndexTree {
  [key: string]: Array<string>;
}

export interface LatLonIndexTree {
  latitudes: LatIndexTree;
  longitudes: LonIndexTree;
}

export interface LandMark {
  lat: number;
  lon: number;
  distances: { [key: string]: number };
}

export interface LandMarks {
  [region: string]: { [key: string]: LandMark };
}
