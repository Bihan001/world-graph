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

export interface LatLon {
  lat: number;
  lon: number;
}
