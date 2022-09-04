import { LatLon } from './interfaces/graph';

const R = 6371;
const p = Math.PI / 180;
const sqrt = Math.sqrt;
const cos = Math.cos;

export const heuristic = (v: LatLon, t: LatLon): number => {
  // Diagonal distance
  // const ans = Math.max(Math.abs(v.lat - t.lat), Math.abs(v.lon - t.lon));

  // Manhattan distance
  // const ans = Math.abs(v.lat - t.lat) + Math.abs(v.lon - t.lon) * 1000;

  // Euclidian distance
  // const ans = Math.sqrt((v.lat - t.lat) ** 2 + (v.lon - t.lon) ** 2) * 1000;

  // ANS SHOULD BE ACTUALLY THE DISTANCE / SPEED. AND ALL EDGE WEIGHTS SHOULD BE TIME TO MOVE INSTEAD OF DISTANCE
  const lat1 = v.lat * p;
  const lon1 = v.lon * p;
  const lat2 = t.lat * p;
  const lon2 = t.lon * p;
  const x = (lat1 + lat2) / 2;
  const ans = R * sqrt((lat2 - lat1) ** 2 + cos(x) * cos(x) * (lon2 - lon1) ** 2) * 1000;
  return ans;
};
