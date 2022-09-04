export interface Region {
  key: string;
  displayName: string;
  description: string;
  size: string;
  dataUrl: string;
  boundary: [number, number, number, number];
  contractionAvailable: boolean;
}

export interface Algorithm {
  key: string;
  displayName: string;
  description: string;
  requirements: string;
  timeComplexity: string;
  spaceComplexity: string;
}

export interface RegionsData {
  [key: string]: Region;
}

export interface AlgorithmsData {
  [key: string]: Algorithm;
}
